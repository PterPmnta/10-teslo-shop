import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() wss: Server;

    constructor(private readonly messagesWsService: MessagesWsService) {}

    handleConnection(client: Socket) {
        console.log(
            '📢 [messages-ws.gateway.ts:21]',
            client.handshake.headers.authentication,
        );
        this.messagesWsService.registerClient(client);
        this.wss.emit(
            'clients-updated',
            this.messagesWsService.getConnectedClients(),
        );
    }

    handleDisconnect(client: any) {
        this.messagesWsService.removeClient(client.id);
        this.wss.emit(
            'clients-updated',
            this.messagesWsService.getConnectedClients(),
        );
    }

    @SubscribeMessage('message-from-client')
    handleMessageFromClient(client: Socket, payload: NewMessageDto) {
        //! Emitir solo al cliente inicial
        /* client.emit('message-from-server', {
            fullName: 'Soy yo!',
            message: payload.message || 'no-message!',
        }); */

        //! Emitir a todos menos al cliente inicial
        /* client.broadcast.emit('message-from-server', {
            fullName: 'Soy yo!',
            message: payload.message || 'no-message!',
        }); */

        //! Emitir a todos los clientes
        this.wss.emit('message-from-server', {
            fullName: 'Soy yo!',
            message: payload.message || 'no-message!',
        });
    }
}
