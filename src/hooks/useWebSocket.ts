import { useEffect, useRef, useState } from 'react';
// import { WebSocket } from 'ws';
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

const useWebSocket = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
    const socketRef = useRef<WebSocket | null>(null);

    const payload = {
        access_key: "kGNj1eVTp7qzxMOwyuQBTMd3nt3Z0M0PbVexIDgx",
        nonce: uuidv4(),
    };

    const jwtToken = jwt.sign(payload, "YHJ6ZmzLE8rtQlKsLP6qzyZr6uajj8MtEdHIcYxf");

    console.log(payload, jwtToken);
    

    return {};
};

export default useWebSocket;