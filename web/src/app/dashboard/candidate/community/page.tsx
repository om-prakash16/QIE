"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Send, 
    Hash, 
    MessageSquare, 
    Users, 
    Circle, 
    Loader2, 
    Search,
    Info,
    MoreHorizontal,
    Smile,
    Paperclip
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import { api, API_BASE_URL } from "@/lib/api/api-client"
import { cn } from "@/lib/utils"

export default function CommunityHubPage() {
    const { user } = useAuth()
    const [rooms, setRooms] = useState<any[]>([])
    const [activeRoom, setActiveRoom] = useState<any>(null)
    const [messages, setMessages] = useState<any[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(true)
    const socketRef = useRef<WebSocket | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchRooms()
    }, [])

    useEffect(() => {
        if (activeRoom) {
            connectWebSocket(activeRoom.id)
            fetchHistory(activeRoom.id)
        }
        return () => {
            if (socketRef.current) {
                socketRef.current.close()
            }
        }
    }, [activeRoom])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const fetchRooms = async () => {
        try {
            const data = await api.chat.getRooms()
            setRooms(data)
            if (data.length > 0) setActiveRoom(data[0])
        } catch (error) {
            console.error("Failed to fetch rooms:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchHistory = async (roomId: string) => {
        try {
            const data = await api.chat.getHistory(roomId)
            setMessages(data)
        } catch (error) {
            console.error("Failed to fetch history:", error)
        }
    }

    const connectWebSocket = (roomId: string) => {
        if (socketRef.current) socketRef.current.close()

        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:"
        const wsHost = API_BASE_URL.replace("http://", "").replace("https://", "")
        const wsUrl = `${wsProtocol}//${wsHost}/chat/ws/${roomId}`

        socketRef.current = new WebSocket(wsUrl)

        socketRef.current.onmessage = (event) => {
            const msg = JSON.parse(event.data)
            setMessages((prev) => [...prev, msg])
        }
    }

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !socketRef.current || !user) return

        const payload = {
            user_id: user.id,
            content: newMessage,
            user_name: user.name
        }

        socketRef.current.send(JSON.stringify(payload))
        setNewMessage("")
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse font-medium">Synchronizing with community nodes...</p>
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-12rem)] flex gap-6">
            {/* Rooms Sidebar */}
            <Card className="w-80 flex flex-col border-white/5 bg-background/60 backdrop-blur-xl overflow-hidden shrink-0">
                <div className="p-6 border-b border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-lg">Channels</h2>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search rooms..." className="pl-9 h-9 bg-white/5 border-white/10" />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-3 space-y-1">
                        {rooms.map((room) => (
                            <button
                                key={room.id}
                                onClick={() => setActiveRoom(room)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group",
                                    activeRoom?.id === room.id 
                                        ? "bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5" 
                                        : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <div className={cn(
                                    "p-1.5 rounded-lg transition-colors",
                                    activeRoom?.id === room.id ? "bg-primary/20" : "bg-muted"
                                )}>
                                    <Hash className="w-4 h-4" />
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">{room.room_name}</p>
                                    <p className="text-[10px] uppercase tracking-tighter opacity-70 font-bold">{room.category}</p>
                                </div>
                                {activeRoom?.id === room.id && (
                                    <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t border-white/5 bg-white/5">
                    <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">1.2k Peers Online</span>
                    </div>
                </div>
            </Card>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col border-white/5 bg-background/60 backdrop-blur-xl overflow-hidden relative shadow-2xl">
                {/* Chat Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                            <Hash className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl">{activeRoom?.room_name}</h3>
                            <p className="text-xs text-muted-foreground">{activeRoom?.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Info className="w-5 h-5 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                        </Button>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-hidden relative">
                    <ScrollArea className="h-full pr-4">
                        <div className="p-6 space-y-8">
                            {messages.map((msg, idx) => {
                                const isMe = msg.user_id === user?.id
                                return (
                                    <motion.div
                                        key={msg.id || idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn("flex gap-3", isMe ? "flex-row-reverse" : "flex-row")}
                                    >
                                        <Avatar className="h-10 w-10 border-2 border-white/5 shadow-xl shrink-0">
                                            <AvatarFallback className={isMe ? "bg-primary text-primary-foreground" : "bg-muted"}>
                                                {msg.user_name?.[0] || 'A'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className={cn("flex flex-col gap-1.5 max-w-[70%]", isMe ? "items-end" : "items-start")}>
                                            <div className="flex items-center gap-2 px-1">
                                                <span className="text-sm font-bold">{msg.user_name}</span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className={cn(
                                                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                                                isMe 
                                                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                                                    : "bg-white/5 border border-white/10 rounded-tl-none"
                                            )}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-white/5 bg-white/5">
                    <form onSubmit={sendMessage} className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={`Message #${activeRoom?.room_name}...`}
                            className="w-full bg-white/5 border-white/10 h-14 pl-14 pr-32 rounded-2xl focus-visible:ring-primary/50 transition-all"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                <Smile className="w-4 h-4" />
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={!newMessage.trim()}
                                className="h-9 px-4 rounded-xl gap-2 shadow-lg shadow-primary/20"
                            >
                                <span className="hidden sm:inline">Send</span>
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-foreground px-2">
                        <span className="flex items-center gap-1"><Circle className="w-2 h-2 fill-green-500 text-green-500" /> Real-time active</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 italic"><Info className="w-3 h-3" /> Professional conduct required</span>
                    </div>
                </div>
            </Card>
        </div>
    )
}
