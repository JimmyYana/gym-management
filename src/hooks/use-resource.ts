import { useEffect, useState } from "react";

export function useResource<T>(load: () => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<
    { load: typeof load; attempt: number; data: T; error?: never } |
    { load: typeof load; attempt: number; data?: never; error: string }
  >();
  useEffect(() => {
    let active = true;
    load().then(
      (data) => { if (active) setState({ load, attempt, data }); },
      (error: Error) => { if (active) setState({ load, attempt, error: error.message }); },
    );
    return () => { active = false; };
  }, [load, attempt]);

  const current = state?.load === load && state.attempt === attempt ? state : undefined;
  return { data: current?.data, error: current?.error, loading: !current, reload: () => setAttempt((value) => value + 1) };
}
