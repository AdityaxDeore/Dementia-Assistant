import { useState, useRef } from "react";
import { Palette, PenTool, Type, Save, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export function CreativeZone() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [writingText, setWritingText] = useState("");
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("#000000");

  const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", 
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500",
    "#800080", "#008000", "#FFC0CB", "#A52A2A"
  ];

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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

  return (
    <Card data-testid="card-creative-zone">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Creative Expression Space
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="draw" data-testid="tab-draw">
                <PenTool className="w-4 h-4 mr-2" />
                Draw
              </TabsTrigger>
              <TabsTrigger value="write" data-testid="tab-write">
                <Type className="w-4 h-4 mr-2" />
                Write
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="draw" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Colors:</span>
                  <div className="flex gap-1">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded border-2 ${
                          selectedColor === color ? 'border-primary' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        data-testid={`color-${color}`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="border rounded-lg p-2 bg-white">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="border border-gray-200 rounded cursor-crosshair w-full"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    data-testid="canvas-drawing"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={clearCanvas}
                    data-testid="button-clear-canvas"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={downloadDrawing}
                    data-testid="button-download-drawing"
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
            className="w-full"
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