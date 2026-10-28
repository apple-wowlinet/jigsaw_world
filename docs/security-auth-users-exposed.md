# 排行榜用户信息暴露修复

## 确认的代码问题

- `v_leaderboard_time`、`v_leaderboard_moves` 使用视图所有者权限连接 `auth.users`，并向 `anon`、`authenticated` 开放。`security_barrier` 并不让视图遵循调用者的 RLS 权限。
- `get_global_leaderboard` 原先直接读取认证元数据。迁移 016 将读取切换为内部公开身份投影；迁移 017 按产品要求恢复原有展示名回退顺序。展示名、头像是允许公开的字段。未发现代码读取并返回邮箱、密码或完整认证记录，不能由本次告警推断这些字段已经泄露。
- 旧迁移对 RPC 只撤销 `PUBLIC` 权限，未撤销 Supabase 默认权限可能直接授予 `anon`、`authenticated` 的执行权限。游戏 RPC 已有登录与归属校验；迁移 016 同时收紧其 ACL，并禁止客户端调用内部计分和周统计刷新函数。

## 修复与部署

1. 在目标 Supabase 项目的 SQL Editor 执行 `supabase/migrations/016_leaderboard_privacy.sql`。整个迁移在事务中执行；需要先应用至 015。它不删除用户或成绩。随后执行 `supabase/migrations/017_restore_leaderboard_identity.sql`。若 016 已执行，只需执行 017；017 可重复执行。
2. 部署配套前端代码。单关排行榜由读取视图改为 `get_puzzle_leaderboard` RPC。迁移应先执行；旧前端在迁移后、部署前会暂时无法读取单关排行榜。
3. 重新运行 Security Advisor，并执行 `supabase/checks/api_security.sql`。前三项应无结果；检查第四项只允许预期 RPC，检查第五项确保私人表保持本人可读。
4. 用匿名身份和两个不同账号检查：旧视图、认证表、内部档案不可读；个人游戏记录只能本人读取；公开排行榜仍显示已发布拼图的成绩。

公开身份投影到不可通过 API 读取的 `private.leaderboard_profiles`，只保存最终展示名和头像 URL。017 恢复原来的名称顺序：`username → full_name → name → display_name → Player <ID前8位>`；头像仍为 `avatar_url → picture`。这些名称字段作为排行榜公开展示名，不使用邮箱兜底，也不复制完整认证元数据。触发器同步新用户和元数据修改，外键级联清理已删除用户。017 同时回填已有资料，无需用户重新登录或重新完成拼图。

旧视图改为 `security_invoker=true`，移除对 `auth.users` 的查询依赖并撤销所有客户端权限。两个排行榜 RPC 使用固定搜索路径，只返回指定公开字段；单关查询限定拼图和档位，返回上限 100。公开昵称和头像依旧是公开信息，用户不应把秘密放入这些字段。

## 审计范围与限制

已检查仓库全部 SQL 迁移中的视图、RLS、`SECURITY DEFINER` 和授权，以及应用内 Supabase 调用和管理员 API。其他私人数据表的策略有用户归属约束；管理员 API 使用服务端 token 校验，service role 客户端使用 `server-only`。这不等于对云端实际配置的完整审计。

本环境 `.env.local` 只有公开 URL 和匿名 key，无法执行管理迁移或读取云端数据库目录，因此本地修改不代表云端已修复。云端可能存在手工创建、未提交到仓库的视图或函数；需要上述目录检查与 Security Advisor 复查。如额外 schema 暴露在 Data API 中，也需将它们加入检查范围。

回归测试：`PGLITE_MODULE_PATH=/absolute/path/to/@electric-sql/pglite node --test tests/leaderboard*.test.cjs`。测试在隔离 PostgreSQL 中应用迁移，模拟 Supabase 默认直接授权，验证匿名/登录角色拒绝旧视图、私有档案和认证表访问，验证本人 RLS、017 对旧资料的回填、名称及头像字段优先级、资料修改同步、用户删除清理、发布边界与参数限制。

参考：[Supabase auth_users_exposed](https://supabase.com/docs/guides/observability/advisors?lint=0002_auth_users_exposed)、[视图权限](https://supabase.com/docs/guides/database/views)。

本次本地验证：TypeScript、相关 ESLint、4 项应用测试通过。2 项 PostgreSQL 集成测试因无可用运行时而跳过；下载运行时遭遇 DNS 故障，本机 Docker 服务未运行。SQL 权限与云端实际状态尚未获得执行验证。
