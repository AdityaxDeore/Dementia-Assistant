import { useState, useRef, useEffect } from "react";
import { Palette, PenTool, Type, Save, Download, Trash2, Circle, Flower2, Square, Minus, Triangle, Undo, Redo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

type DrawingTool = 'pen' | 'rectangle' | 'circle' | 'line' | 'triangle';

interface Point {
  x: number;
  y: number;
}

export function CreativeZone() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chakraCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [writingText, setWritingText] = useState("");
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedChakra, setSelectedChakra] = useState(0);
  const [chakraColors, setChakraColors] = useState<Record<string, string>>({});
  const [currentTool, setCurrentTool] = useState<DrawingTool>('pen');
  const [brushSize, setBrushSize] = useState([2]);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [tempCanvas, setTempCanvas] = useState<ImageData | null>(null);
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);

  // Save state for undo functionality
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev.slice(-19), imageData]); // Keep last 20 states
    setRedoStack([]); // Clear redo stack when new action is performed
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Save current state to redo stack
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setRedoStack(prev => [...prev, currentState]);
    
    // Restore previous state
    const previousState = undoStack[undoStack.length - 1];
    ctx.putImageData(previousState, 0, 0);
    
    // Remove from undo stack
    setUndoStack(prev => prev.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Save current state to undo stack
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev, currentState]);
    
    // Restore next state
    const nextState = redoStack[redoStack.length - 1];
    ctx.putImageData(nextState, 0, 0);
    
    // Remove from redo stack
    setRedoStack(prev => prev.slice(0, -1));
  };

  const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", 
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500",
    "#800080", "#008000", "#FFC0CB", "#A52A2A"
  ];

  // Chakra definitions with traditional colors
  const chakras = [
    {
      name: "Root Chakra",
      description: "Grounding & Security",
      traditionalColor: "#FF0000",
      symbol: "🔴",
      outline: "M150,350 Q100,300 150,250 Q200,300 150,350 Z"
    },
    {
      name: "Sacral Chakra", 
      description: "Creativity & Emotion",
      traditionalColor: "#FF7F00",
      symbol: "🟠",
      outline: "M150,350 L100,300 L100,250 L200,250 L200,300 Z"
    },
    {
      name: "Solar Plexus",
      description: "Personal Power",
      traditionalColor: "#FFFF00",
      symbol: "🟡",
      outline: "M150,350 L120,300 L120,280 L100,250 L200,250 L180,280 L180,300 Z"
    },
    {
      name: "Heart Chakra",
      description: "Love & Compassion", 
      traditionalColor: "#00FF00",
      symbol: "💚",
      outline: "M150,350 Q100,320 120,280 Q140,250 150,270 Q160,250 180,280 Q200,320 150,350 Z"
    },
    {
      name: "Throat Chakra",
      description: "Communication",
      traditionalColor: "#0000FF",
      symbol: "🔵",
      outline: "M150,350 Q110,330 110,300 Q110,270 150,250 Q190,270 190,300 Q190,330 150,350 Z"
    },
    {
      name: "Third Eye",
      description: "Intuition & Wisdom",
      traditionalColor: "#4B0082",
      symbol: "🟣",
      outline: "M150,350 Q120,320 130,290 Q140,260 150,250 Q160,260 170,290 Q180,320 150,350 Z"
    },
    {
      name: "Crown Chakra",
      description: "Spiritual Connection",
      traditionalColor: "#8B00FF",
      symbol: "🟪",
      outline: "M150,350 Q130,330 130,310 Q130,290 140,270 Q150,250 160,270 Q170,290 170,310 Q170,330 150,350 Z"
    }
  ];

  // Initialize canvas when component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set default canvas properties
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.imageSmoothingEnabled = true;
        
        // Save initial state
        setTimeout(() => {
          const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height);
          setUndoStack([initialState]);
        }, 100);
      }
    }
    
    // Initialize chakra canvas
    const chakraCanvas = chakraCanvasRef.current;
    if (chakraCanvas) {
      drawChakraOutline(chakraCanvas, selectedChakra);
    }
  }, []);

  // Update chakra canvas when selectedChakra changes
  useEffect(() => {
    const canvas = chakraCanvasRef.current;
    if (canvas) {
      drawChakraOutline(canvas, selectedChakra);
    }
  }, [selectedChakra]);

  // Get accurate canvas coordinates
  const getCanvasCoordinates = (canvas: HTMLCanvasElement, e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const point = getCanvasCoordinates(canvas, e);
    setStartPoint(point);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Save canvas state for shape drawing
    if (currentTool !== 'pen') {
      setTempCanvas(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }
    
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    ctx.lineWidth = brushSize[0];
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (currentTool === 'pen') {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const currentPoint = getCanvasCoordinates(canvas, e);
    
    if (currentTool === 'pen') {
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
    } else if (startPoint && tempCanvas) {
      // Clear canvas and redraw background
      ctx.putImageData(tempCanvas, 0, 0);
      
      // Draw preview shape
      drawShape(ctx, startPoint, currentPoint, currentTool);
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      saveCanvasState(); // Save state after drawing
    }
    setIsDrawing(false);
    setStartPoint(null);
    setTempCanvas(null);
  };

  const drawShape = (ctx: CanvasRenderingContext2D, start: Point, end: Point, tool: DrawingTool) => {
    ctx.beginPath();
    
    switch (tool) {
      case 'rectangle':
        const width = end.x - start.x;
        const height = end.y - start.y;
        ctx.strokeRect(start.x, start.y, width, height);
        break;
        
      case 'circle':
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
        
      case 'line':
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        break;
        
      case 'triangle':
        const centerX = (start.x + end.x) / 2;
        ctx.moveTo(centerX, start.y);
        ctx.lineTo(start.x, end.y);
        ctx.lineTo(end.x, end.y);
        ctx.closePath();
        ctx.stroke();
        break;
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Clear and set white background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    console.log('Canvas cleared');
  };

  const saveCreation = () => {
    console.log('Saving creation...', { title, writingText });
    // TODO: Save to backend
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = title || 'my-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
    console.log('Downloaded drawing');
  };

  // Chakra coloring functions
  const drawChakraOutline = (canvas: HTMLCanvasElement, chakraIndex: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set outline style
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.fillStyle = 'transparent';
    
    // Draw chakra based on index
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    
    ctx.beginPath();
    
    switch (chakraIndex) {
      case 0: // Root - Square
        ctx.rect(centerX - radius, centerY - radius, radius * 2, radius * 2);
        break;
      case 1: // Sacral - Circle with crescents
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.moveTo(centerX - radius/2, centerY);
        ctx.arc(centerX - radius/4, centerY, radius/4, 0, Math.PI * 2);
        ctx.moveTo(centerX + radius/2, centerY);
        ctx.arc(centerX + radius/4, centerY, radius/4, 0, Math.PI * 2);
        break;
      case 2: // Solar Plexus - Triangle
        ctx.moveTo(centerX, centerY - radius);
        ctx.lineTo(centerX - radius, centerY + radius/2);
        ctx.lineTo(centerX + radius, centerY + radius/2);
        ctx.closePath();
        break;
      case 3: // Heart - Star/Cross
        ctx.moveTo(centerX, centerY - radius);
        ctx.lineTo(centerX, centerY + radius);
        ctx.moveTo(centerX - radius, centerY);
        ctx.lineTo(centerX + radius, centerY);
        ctx.moveTo(centerX - radius*0.7, centerY - radius*0.7);
        ctx.lineTo(centerX + radius*0.7, centerY + radius*0.7);
        ctx.moveTo(centerX + radius*0.7, centerY - radius*0.7);
        ctx.lineTo(centerX - radius*0.7, centerY + radius*0.7);
        // Add heart shape
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX - radius/3, centerY - radius/3, radius/3, 0, Math.PI * 2);
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX + radius/3, centerY - radius/3, radius/3, 0, Math.PI * 2);
        break;
      case 4: // Throat - Circle with petals
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        for (let i = 0; i < 16; i++) {
          const angle = (Math.PI * 2 * i) / 16;
          const x = centerX + Math.cos(angle) * radius * 1.2;
          const y = centerY + Math.sin(angle) * radius * 1.2;
          ctx.moveTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
          ctx.lineTo(x, y);
        }
        break;
      case 5: // Third Eye - Eye shape
        ctx.ellipse(centerX, centerY, radius, radius/2, 0, 0, Math.PI * 2);
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius/3, 0, Math.PI * 2);
        break;
      case 6: // Crown - Lotus petals
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 * i) / 8;
          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;
          const x2 = centerX + Math.cos(angle) * radius * 1.5;
          const y2 = centerY + Math.sin(angle) * radius * 1.5;
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo(x2, y2, 
            centerX + Math.cos(angle + Math.PI/4) * radius, 
            centerY + Math.sin(angle + Math.PI/4) * radius);
        }
        break;
    }
    
    ctx.stroke();
  };
  
  const handleChakraClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = chakraCanvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is within the chakra area and fill with selected color
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Simple flood fill simulation - just fill the center area with selected color
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    
    if (distance < 80) {
      ctx.fillStyle = selectedColor;
      ctx.globalAlpha = 0.7;
      
      // Fill based on chakra shape
      ctx.beginPath();
      switch (selectedChakra) {
        case 0: // Root - Square
          ctx.fillRect(centerX - 80, centerY - 80, 160, 160);
          break;
        case 1: // Sacral - Circle
          ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 2: // Solar Plexus - Triangle
          ctx.moveTo(centerX, centerY - 80);
          ctx.lineTo(centerX - 80, centerY + 40);
          ctx.lineTo(centerX + 80, centerY + 40);
          ctx.closePath();
          ctx.fill();
          break;
        default: // Others - Circle
          ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
          ctx.fill();
      }
      
      ctx.globalAlpha = 1;
      // Redraw outline
      drawChakraOutline(canvas, selectedChakra);
    }
  };
  
  const selectChakra = (index: number) => {
    setSelectedChakra(index);
    const canvas = chakraCanvasRef.current;
    if (canvas) {
      drawChakraOutline(canvas, index);
    }
  };
  
  const clearChakra = () => {
    const canvas = chakraCanvasRef.current;
    if (canvas) {
      drawChakraOutline(canvas, selectedChakra);
    }
  };
  
  const downloadChakra = () => {
    const canvas = chakraCanvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `${chakras[selectedChakra].name.toLowerCase().replace(' ', '-')}-coloring.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Card data-testid="card-creative-zone" className="border-0 shadow-lg bg-gradient-to-br from-violet-400/10 via-purple-400/10 to-indigo-400/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-lg shadow-lg">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <span className="text-slate-800 font-bold">Creative Expression Space</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Give your creation a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            data-testid="input-creation-title"
          />
          
          <Tabs defaultValue="draw" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur-sm border border-slate-200/60 shadow-sm">
              <TabsTrigger value="draw" data-testid="tab-draw" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg">
                <PenTool className="w-4 h-4 mr-2" />
                Draw
              </TabsTrigger>
              <TabsTrigger value="chakras" data-testid="tab-chakras" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-400 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg">
                <Circle className="w-4 h-4 mr-2" />
                Chakras
              </TabsTrigger>
              <TabsTrigger value="write" data-testid="tab-write" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-400 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg">
                <Type className="w-4 h-4 mr-2" />
                Write
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="draw" className="space-y-4">
              <div className="space-y-4">
                {/* Drawing Tools */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Tools:</span>
                    <div className="flex gap-1">
                      {[
                        { tool: 'pen' as DrawingTool, icon: PenTool, label: 'Pen' },
                        { tool: 'rectangle' as DrawingTool, icon: Square, label: 'Rectangle' },
                        { tool: 'circle' as DrawingTool, icon: Circle, label: 'Circle' },
                        { tool: 'line' as DrawingTool, icon: Minus, label: 'Line' },
                        { tool: 'triangle' as DrawingTool, icon: Triangle, label: 'Triangle' }
                      ].map(({ tool, icon: Icon, label }) => (
                        <Button
                          key={tool}
                          variant={currentTool === tool ? "default" : "outline"}
                          size="sm"
                          className={`p-2 ${currentTool === tool ? 'bg-blue-500 text-white' : ''}`}
                          onClick={() => setCurrentTool(tool)}
                          title={label}
                        >
                          <Icon className="w-4 h-4" />
                        </Button>
                      ))}
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {currentTool.charAt(0).toUpperCase() + currentTool.slice(1)}
                    </Badge>
                  </div>
                  
                  {/* Brush Size */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Size:</span>
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs text-gray-500">1</span>
                      <Slider
                        value={brushSize}
                        onValueChange={setBrushSize}
                        max={20}
                        min={1}
                        step={1}
                        className="flex-1 max-w-[200px]"
                      />
                      <span className="text-xs text-gray-500">20</span>
                      <Badge variant="secondary" className="min-w-[40px] text-center">
                        {brushSize[0]}px
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Color Palette */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Colors:</span>
                  <div className="flex gap-1 flex-wrap">
                    {colors.map((color) => (
                      <button
                        key={color}
                        title={`Select color ${color}`}
                        aria-label={`Select color ${color}`}
                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                          selectedColor === color ? 'border-gray-800 shadow-lg scale-110' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        data-testid={`color-${color}`}
                      />
                    ))}
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
                      title="Custom color picker"
                    />
                  </div>
                </div>
                
                {/* Canvas */}
                <div className="border-2 rounded-lg p-4 bg-white shadow-inner">
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={600}
                      className="border border-gray-300 rounded cursor-crosshair max-w-full h-auto block"
                      style={{ 
                        touchAction: 'none',
                        imageRendering: 'pixelated'
                      }}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        const mouseEvent = new MouseEvent('mousedown', {
                          clientX: touch.clientX,
                          clientY: touch.clientY
                        });
                        startDrawing(mouseEvent as any);
                      }}
                      onTouchMove={(e) => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        const mouseEvent = new MouseEvent('mousemove', {
                          clientX: touch.clientX,
                          clientY: touch.clientY
                        });
                        draw(mouseEvent as any);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        stopDrawing();
                      }}
                      data-testid="canvas-drawing"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs text-gray-600">
                      {currentTool === 'pen' ? 'Click and drag to draw' : `Click and drag to draw ${currentTool}`}
                    </div>
                  </div>
                </div>
                
                {/* Canvas Controls */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={undo}
                      disabled={undoStack.length === 0}
                      size="sm"
                      title="Undo"
                    >
                      <Undo className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={redo}
                      disabled={redoStack.length === 0}
                      size="sm"
                      title="Redo"
                    >
                      <Redo className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={clearCanvas}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      data-testid="button-clear-canvas"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Canvas
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={downloadDrawing}
                      data-testid="button-download-drawing"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={saveCreation}
                      data-testid="button-save-creation"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="chakras" className="space-y-4">
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-slate-800">Chakra Coloring Book</h3>
                  <p className="text-sm text-slate-600">Color the chakras to balance your energy and promote mindfulness</p>
                </div>
                
                {/* Chakra Selection */}
                <div className="space-y-3">
                  <span className="text-sm font-medium">Choose a Chakra:</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {chakras.map((chakra, index) => (
                      <button
                        key={index}
                        onClick={() => selectChakra(index)}
                        className={`p-3 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                          selectedChakra === index 
                            ? 'border-violet-400 bg-violet-50 shadow-md' 
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{chakra.symbol}</span>
                          <span className="text-xs font-medium truncate">{chakra.name}</span>
                        </div>
                        <div className="text-xs text-gray-500 truncate">{chakra.description}</div>
                        <div 
                          className="w-4 h-4 rounded border mt-1" 
                          style={{ backgroundColor: chakra.traditionalColor }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Color Palette */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Colors:</span>
                  <div className="flex gap-1">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded border-2 transition-transform hover:scale-110 ${
                          selectedColor === color ? 'border-violet-400 scale-110' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        title={`Select ${color}`}
                      />
                    ))}
                  </div>
                  <button
                    className={`px-2 py-1 text-xs rounded border-2 transition-all hover:scale-105 ${
                      selectedColor === chakras[selectedChakra].traditionalColor 
                        ? 'border-violet-400 bg-violet-50' 
                        : 'border-gray-300 bg-white'
                    }`}
                    onClick={() => setSelectedColor(chakras[selectedChakra].traditionalColor)}
                  >
                    Traditional
                  </button>
                </div>
                
                {/* Chakra Canvas */}
                <div className="border rounded-lg p-4 bg-white">
                  <div className="text-center mb-2">
                    <h4 className="font-medium text-slate-800">{chakras[selectedChakra].name}</h4>
                    <p className="text-sm text-slate-600">{chakras[selectedChakra].description}</p>
                  </div>
                  <canvas
                    ref={chakraCanvasRef}
                    width={300}
                    height={300}
                    className="border border-gray-200 rounded cursor-pointer mx-auto block"
                    onClick={handleChakraClick}
                    data-testid="canvas-chakra"
                  />
                  <div className="text-center mt-2">
                    <p className="text-xs text-slate-500">Click inside the chakra shape to fill with selected color</p>
                  </div>
                </div>
                
                {/* Chakra Controls */}
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={clearChakra}
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={downloadChakra}
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="write" className="space-y-4">
              <Textarea
                placeholder="Express yourself through words... Write a poem, story, or just your thoughts..."
                value={writingText}
                onChange={(e) => setWritingText(e.target.value)}
                className="min-h-[300px] resize-none"
                data-testid="textarea-writing"
              />
              <div className="text-sm text-muted-foreground">
                {writingText.length} characters
              </div>
            </TabsContent>
          </Tabs>
          
          <Button 
            onClick={saveCreation} 
            className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            disabled={!title && !writingText}
            data-testid="button-save-creation"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Creation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}