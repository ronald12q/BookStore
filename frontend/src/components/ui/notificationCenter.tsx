import { Alert, CloseButton, Spinner } from "@heroui/react";
import { useEffect } from "react";
import { useNotificationStore, type NotificationStatus } from "../../store/notificationStore";

const statusClass: Record<NotificationStatus, "success" | "danger" | "warning" | "default"> = {
  success: 'success',
  danger: 'danger',
  warning: 'warning',
  accent: 'default',
};

export const NotificationCenter = () => {
  const { items, remove } = useNotificationStore();

  useEffect(() => {
    const timers = items.map((item) => {
      const duration = item.duration ?? 2500;
      return window.setTimeout(() => remove(item.id), duration);
    });

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [items, remove]);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-[min(92vw,24rem)] flex-col gap-3 sm:bottom-6 sm:right-6">
      {items.map((item) => (
        <Alert key={item.id} status={statusClass[item.status]} className="animate-notification-in border border-white/10 bg-[#151311]/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <Alert.Indicator className="animate-notification-pulse">
            {item.status === 'accent' ? <Spinner size="sm" /> : <span className="block size-2.5 rounded-full bg-current" />}
          </Alert.Indicator>
          <Alert.Content>
            <Alert.Title>{item.title}</Alert.Title>
            {item.description && <Alert.Description>{item.description}</Alert.Description>}
          </Alert.Content>
          <CloseButton onPress={() => remove(item.id)} />
        </Alert>
      ))}
    </div>
  );
};
