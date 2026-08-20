-- Phase 1 scaffold: no application tables yet. This migration exists so the
-- migration runner and Docker volume pipeline are proven before phase 2 needs them.
CREATE TABLE IF NOT EXISTS _placeholder (
  id INTEGER PRIMARY KEY
);
