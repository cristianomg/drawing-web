import React, {useCallback, useEffect, useRef, useState} from 'react';
import '../App.css';

const Canvas = ({width, height, predictImage}) => {
    const canvasRef = useRef(null);
    const [isPainting, setIsPainting] = useState(false);
    const [mousePosition, setMousePosition] =
        useState(undefined);

    const startPaint = useCallback((event) => {
        const coordinates = getCoordinates(event);

        if (coordinates) {
            setMousePosition(coordinates);
            setIsPainting(true);
        }
    }, []);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        const canvas = canvasRef.current;
        canvas.addEventListener('mousedown', startPaint);

        return () => {
            canvas.removeEventListener('mousedown', startPaint);
        };
    }, [startPaint]);

    const paint = useCallback(
        (event) => {
            if (isPainting) {
                const newMousePosition = getCoordinates(event);

                if (mousePosition && newMousePosition) {
                    drawLine(mousePosition, newMousePosition);
                    setMousePosition(newMousePosition);
                }
            }
        },
        [isPainting, mousePosition],
    );

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        const canvas = canvasRef.current;
        canvas.addEventListener('mousemove', paint);

        return () => {
            canvas.removeEventListener('mousemove', paint);
        };
    }, [paint]);

    const exitPaint = useCallback(() => {
        setIsPainting(false);
        setMousePosition(undefined);

        const canvas = document.getElementById(
            'canvas',
        );

        canvas.toBlob(async (blob) => {
            await predictImage(blob);
        });
    }, []);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        canvas.addEventListener('mouseup', exitPaint);
        canvas.addEventListener('mouseleave', exitPaint);
        return () => {
            canvas.removeEventListener('mouseup', exitPaint);
            canvas.removeEventListener('mouseleave', exitPaint);
        };
    }, [exitPaint]);

    const getCoordinates = (event) => {
        if (!canvasRef.current) {
            return;
        }

        const canvas= canvasRef.current;
        return {
            x: event.pageX - canvas.offsetLeft,
            y: event.pageY - canvas.offsetTop,
        };
    };

    const drawLine = (
        originalMousePosition,
        newMousePosition,
    ) => {
        if (!canvasRef.current) {
            return;
        }

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) {
            return;
        }

        context.strokeStyle = 'black';
        context.lineJoin = 'round';
        context.lineWidth = 20;

        context.beginPath();
        context.moveTo(originalMousePosition.x, originalMousePosition.y);
        context.lineTo(newMousePosition.x, newMousePosition.y);
        context.closePath();

        context.stroke();
    };

    return (
        <canvas
            id="canvas"
            ref={canvasRef}
            height={height}
            width={width}
            className="card"
        />
    );
};

Canvas.defaultProps = {
    width: 500,
    height: 500,
};

export default Canvas;
