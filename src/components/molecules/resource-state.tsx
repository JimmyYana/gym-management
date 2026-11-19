import { Button } from "@/components/atoms/controls";

export function ResourceState({ loading, error, reload }: { loading: boolean; error?: string; reload: () => void }) {
  if (loading) return <p className="notice" role="status">Cargando…</p>;
  if (!error) return null;
  return <div className="notice" role="alert">{error} <Button onClick={reload}>Reintentar</Button></div>;
}
