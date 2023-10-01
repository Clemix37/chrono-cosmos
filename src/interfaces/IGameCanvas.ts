export default interface IGameCanvas {
    id:string;
    canvas:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;
    width:number;
    height:number;
    bgColor:string;
}