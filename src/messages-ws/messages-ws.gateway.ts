import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    constructor(private readonly messagesWsService: MessagesWsService) {}
    handleConnection(client: Socket) {
        //throw new Error('Method not implemented.');
        console.log('Cliente conectado', client.id);
    }
    handleDisconnect(client: any) {
        //throw new Error('Method not implemented.');
        console.log('Cliente desconectado', client.id);
    }
}
