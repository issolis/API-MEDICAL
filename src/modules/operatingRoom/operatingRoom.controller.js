import { OperatingRoomService } from "./operatingRoom.service.js";

export class OperatingRoomController {

    static async getAll(req, res) {
        try {
            const rooms = await OperatingRoomService.getAll();

            res.json({
                success: true,
                count: rooms.length,
                data: rooms
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getById(req, res) {
        try {
            const id = Number(req.params.id);

            const room = await OperatingRoomService.getById(id);

            res.json({
                success: true,
                data: room
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}