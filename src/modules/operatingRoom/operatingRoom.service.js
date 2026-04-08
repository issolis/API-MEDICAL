import { OperatingRoom } from "./operatingRoom.model.js";

export class OperatingRoomService {

    static async getAll() {
        return await OperatingRoom.getAll();
    }

    static async getById(id) {
        const room = await OperatingRoom.getById(id);

        if (!room) {
            throw new Error("Operating room not found");
        }

        return room;
    }
}