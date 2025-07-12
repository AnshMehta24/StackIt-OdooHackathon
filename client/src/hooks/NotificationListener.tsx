import { socket } from "@/socket/socket";
import { useEffect } from "react";
import { toast } from "sonner";

export default function NotificationListener() {
  useEffect(() => {
    socket.on("new-answer", (data) => {
      console.log("📥 New Answer Notification:", data);
      toast(data.message);
    });

    return () => {
      socket.off("new-answer");
    };
  }, []);

  return null;
}
