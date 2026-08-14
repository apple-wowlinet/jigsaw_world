-- Support second- and third-level categories (and deeper trees if needed).
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS parent_id uuid
  REFERENCES public.categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_categories_parent
  ON public.categories (parent_id, sort_order)
  WHERE is_active = true;

CREATE OR REPLACE FUNCTION public.prevent_category_cycle()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  has_cycle boolean;
BEGIN
  IF NEW.parent_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.parent_id = NEW.id THEN
    RAISE EXCEPTION 'A category cannot be its own parent';
  END IF;

  WITH RECURSIVE ancestors AS (
    SELECT id, parent_id
    FROM public.categories
    WHERE id = NEW.parent_id

    UNION ALL

    SELECT category.id, category.parent_id
    FROM public.categories AS category
    JOIN ancestors ON category.id = ancestors.parent_id
  )
  SELECT EXISTS (
    SELECT 1 FROM ancestors WHERE id = NEW.id
  ) INTO has_cycle;

  IF has_cycle THEN
    RAISE EXCEPTION 'Category hierarchy cannot contain a cycle';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_categories_prevent_cycle ON public.categories;
CREATE TRIGGER trg_categories_prevent_cycle
  BEFORE INSERT OR UPDATE OF parent_id ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.prevent_category_cycle();
