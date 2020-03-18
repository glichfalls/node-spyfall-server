

export interface Command {
    command : number,
    game : {
        id : string,
        time: number
    },
    player: {
        name: string
    }
}