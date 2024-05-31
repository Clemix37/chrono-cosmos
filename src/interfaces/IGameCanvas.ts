export default interface IGameCanvas {
    id:string; // Id of canvas in HTML
    canvas:HTMLCanvasElement; // Canvas element in the DOM
    ctx:CanvasRenderingContext2D; // Canvas context to render elements
    width:number; //  Width of the canvas
    height:number; // Height of the canvas
    bgColor:string; // Background color of the canvas
}