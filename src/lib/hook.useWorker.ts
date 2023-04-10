import { useCallback, useEffect, useRef } from "react";

export type UseWorkerOnMessage<MessageResponse> = (
  messageEvent: MessageEvent<MessageResponse>,
  worker: Worker
) => void | Promise<void>;

export type UseWorkerParams<T> = { onMessage: UseWorkerOnMessage<T> } & (
  | {
      type: "local";
      worker: Worker;
    }
  | {
      type: "remote";
      url: string;
    }
);

export const useWorker = <MessageResponse>(params: UseWorkerParams<MessageResponse>) => {
  // Similar to an instance field in a class
  const workerRef = useRef<Worker | null>(null);

  // Function to always get a worker instance
  // Advanced React - Accessing expensive references
  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      if (params.type === "local") {
        workerRef.current = params.worker;
        workerRef.current.onmessage = (event) => {
          if (workerRef.current) {
            params.onMessage(event, workerRef.current);
          }
        };
      } else {
        workerRef.current = new Worker(params.url, {
          type: "module",
        });
        workerRef.current.onmessage = (event) => {
          if (workerRef.current) {
            params.onMessage(event, workerRef.current);
          }
        };
      }
    }

    return workerRef.current;
  }, [params]);

  useEffect(() => {
    return () => {
      if (!workerRef.current) return;
      workerRef.current.terminate();
      workerRef.current = null;
    };
  }, []);

  return getWorker();
};
