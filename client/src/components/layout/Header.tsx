import { useEffect, useState } from "react";
import { Search, Bell, Plus, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router";
import { toast } from "sonner";
import { socket } from "@/socket/socket";
import { useUser } from "@/hooks/services/user";
import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newNotification, setNewNotification] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const { data: User } = useUser();

  useEffect(() => {
    if (!socket) return;
    const handleConnect = () => {
      if (User?.success && User.data.id) {
        socket.emit("join", User.data.id);
        console.log("🔁 Rejoined socket room:", User.data.id);
      }
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [User]);

  useEffect(() => {
    socket.on("new-answer", (data) => {
      console.log("📥 New Answer Notification:", data);
      setNewNotification(true);
      toast(data.message);
    });

    return () => {
      socket.off("new-answer");
    };
  }, []);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getAll,
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });

  return (
    <header className="sticky top-0 z-50 p-4 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-nav items-center justify-between ">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-foreground font-bold text-lg">
            S
          </div>
          <span className="text-xl font-bold">StackIt</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </form>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Ask Question Button */}
          <Button asChild className="hidden sm:flex text-foreground">
            <Link to="/ask">
              <Plus className="h-4 w-4 mr-2" />
              Ask Question
            </Link>
          </Button>

          <Button size="icon" asChild className="sm:hidden">
            <Link to="/ask">
              <Plus className="h-4 w-4" />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {newNotification && (
                  <Badge
                    variant="destructive"
                    className="absolute top-1 right-1 h-3 w-3 flex items-center justify-center p-0 text-xs"
                  ></Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-96 max-h-96 overflow-auto"
            >
              <div className="p-3 font-semibold">Notifications</div>
              <DropdownMenuSeparator />

              {isLoading && (
                <div className="p-4 text-sm text-muted-foreground">
                  Loading notifications...
                </div>
              )}

              {!isLoading && notifications?.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground">
                  No new notifications.
                </div>
              )}

              {!isLoading &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                notifications.data?.map((notif: any) => (
                  <DropdownMenuItem
                    key={notif.id}
                    className="p-3 hover:bg-muted/40"
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {notif.triggeredBy?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{notif.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-primary self-center" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}

              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar>
                  <AvatarImage src="/avatars/current-user.jpg" />
                  <AvatarFallback>
                    <User2 className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile">Your Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/questions">Your Questions</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/answers">Your Answers</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
