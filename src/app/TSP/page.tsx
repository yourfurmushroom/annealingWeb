'use client'
/* eslint-disable */
import React, { useActionState, useEffect, useRef, useState } from "react";
import Navbar from "../dashboard/Component/Navbar";
import { useRouter } from 'next/navigation';

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const router = useRouter();
    const [pageName, setPageName, isLoaded] = useActionState((prev: string, nextPage: string) => {
        return nextPage
    }, 'TSP')
    useEffect(() => {
        console.log(pageName)
        if (pageName === "Dashboard") {
            router.push("/dashboard")
        }
        else if (pageName === "Digital") {
            router.push("/digitalAnnealing")
        }
        else if(pageName==="TSP")
        {
            router.push("/TSP")
        }
    }, [pageName])

    // State for houses positions (5 houses)
    const [houses, setHouses] = useState<{x: number, y: number}[]>([]);
    // State for current path (array of indices, e.g., [0,1,2,3,4])
    const [currentPath, setCurrentPath] = useState<number[]>([]);
    // State for current distance
    const [currentDistance, setCurrentDistance] = useState<number>(0);
    // Distances matrix
    const [distances, setDistances] = useState<number[][]>([]);
    // State for iteration speed (in milliseconds)
    const [iterationSpeed, setIterationSpeed] = useState<number>(500); // Default 2 seconds
    // State for selected starting point (null if not set)
    const [startPoint, setStartPoint] = useState<number | null>(null);
    // State for panel position and dragging
    const [panelPosition, setPanelPosition] = useState<{x: number, y: number}>({ x: 10, y: 10 });
    const [isDraggingPanel, setIsDraggingPanel] = useState<boolean>(false);
    const [dragOffset, setDragOffset] = useState<{x: number, y: number}>({ x: 0, y: 0 });
    // State for dragging houses
    const [draggingHouse, setDraggingHouse] = useState<number | null>(null);

    // Simulated Annealing parameters
    const initialTemp = 1000;
    const coolingRate = 0.995;
    const [temperature, setTemperature] = useState(initialTemp);

    // Function to initialize or reinitialize
    const initialize = () => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const width = window.innerWidth;
            const height = window.innerHeight - 50; // Adjust for navbar or other elements
            canvas.width = width;
            canvas.height = height;

            // Generate 5 random houses
            const newHouses = Array.from({length: 5}, () => ({
                x: Math.random() * (width - 100) + 50,
                y: Math.random() * (height - 100) + 50
            }));
            setHouses(newHouses);

            // Compute distances (Euclidean, rounded to integers)
            const newDistances = newHouses.map((h1, i) =>
                newHouses.map((h2, j) => {
                    if (i === j) return 0;
                    return Math.round(Math.sqrt(Math.pow(h1.x - h2.x, 2) + Math.pow(h1.y - h2.y, 2)));
                })
            );
            setDistances(newDistances);

            // Initial random path (permutation of 0 to 4)
            let initialPath = [0,1,2,3,4].sort(() => Math.random() - 0.5);
            // If startPoint is set, ensure it is first
            if (startPoint !== null) {
                const idx = initialPath.indexOf(startPoint);
                if (idx !== -1) {
                    initialPath.splice(idx, 1);
                    initialPath = [startPoint, ...initialPath];
                }
            }
            setCurrentPath(initialPath);
            setCurrentDistance(calculatePathDistance(initialPath, newDistances));

            // Reset temperature
            setTemperature(initialTemp);
        }
    };

    // Generate random houses and initial path on mount
    useEffect(() => {
        initialize();
    }, []);

    // Function to calculate path distance
    const calculatePathDistance = (path: number[], dists: number[][]): number => {
        let dist = 0;
        for (let i = 0; i < path.length; i++) {
            dist += dists[path[i]][path[(i + 1) % path.length]];
        }
        return dist;
    };

    // Perform one SA iteration
    const performSAIteration = () => {
        if (currentPath.length === 0 || distances.length === 0) return;

        // Copy current path
        let newPath = [...currentPath];

        // Swap two random cities, excluding the start point if set
        let idx1 = startPoint !== null ? Math.floor(Math.random() * 4) + 1 : Math.floor(Math.random() * 5);
        let idx2 = startPoint !== null ? Math.floor(Math.random() * 4) + 1 : Math.floor(Math.random() * 5);
        while (idx1 === idx2) idx2 = startPoint !== null ? Math.floor(Math.random() * 4) + 1 : Math.floor(Math.random() * 5);
        [newPath[idx1], newPath[idx2]] = [newPath[idx2], newPath[idx1]];

        // Calculate deltas
        const newDist = calculatePathDistance(newPath, distances);
        const delta = newDist - currentDistance;

        // Accept if better or with probability
        if (delta < 0 || Math.random() < Math.exp(-delta / temperature)) {
            setCurrentPath(newPath);
            setCurrentDistance(newDist);
        }

        // Cool down
        setTemperature(prev => prev * coolingRate);
    };

    // Run iteration based on iterationSpeed
    useEffect(() => {
        const interval = setInterval(() => {
            performSAIteration();
        }, iterationSpeed);

        return () => clearInterval(interval);
    }, [currentPath, currentDistance, temperature, distances, iterationSpeed, startPoint]);

    // Handle canvas mouse down to start dragging a house or set start point
    const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            // Find closest house
            let closestIdx = -1;
            let minDist = Infinity;
            houses.forEach((house, idx) => {
                const dist = Math.sqrt(Math.pow(house.x - clickX, 2) + Math.pow(house.y - clickY, 2));
                if (dist < minDist && dist < 20) { // Threshold to ensure click is near a house
                    minDist = dist;
                    closestIdx = idx;
                }
            });

            if (closestIdx !== -1) {
                setDraggingHouse(closestIdx);
                setDragOffset({
                    x: clickX - houses[closestIdx].x,
                    y: clickY - houses[closestIdx].y
                });
            }
        }
    };

    // Handle canvas mouse move to drag house
    const handleCanvasMouseMove = (event: MouseEvent) => {
        if (draggingHouse !== null && canvasRef.current) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            // Update house position
            const newHouses = [...houses];
            newHouses[draggingHouse] = {
                x: mouseX - dragOffset.x,
                y: mouseY - dragOffset.y
            };
            setHouses(newHouses);
        }
    };

    // Handle canvas mouse up to stop dragging and recalculate
    const handleCanvasMouseUp = () => {
        if (draggingHouse !== null) {
            // Recalculate distances based on new house positions
            const newDistances = houses.map((h1, i) =>
                houses.map((h2, j) => {
                    if (i === j) return 0;
                    return Math.round(Math.sqrt(Math.pow(h1.x - h2.x, 2) + Math.pow(h1.y - h2.y, 2)));
                })
            );
            setDistances(newDistances);

            // Generate new random path, respecting startPoint
            let newPath = [0,1,2,3,4].sort(() => Math.random() - 0.5);
            if (startPoint !== null) {
                const idx = newPath.indexOf(startPoint);
                if (idx !== -1) {
                    newPath.splice(idx, 1);
                    newPath = [startPoint, ...newPath];
                }
            }
            setCurrentPath(newPath);
            setCurrentDistance(calculatePathDistance(newPath, newDistances));

            // Reset temperature
            setTemperature(initialTemp);

            setDraggingHouse(null);
        }
    };

    // Handle canvas click to set starting point (only if not dragging)
    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (draggingHouse === null && canvasRef.current) {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;

            // Find closest house
            let closestIdx = -1;
            let minDist = Infinity;
            houses.forEach((house, idx) => {
                const dist = Math.sqrt(Math.pow(house.x - clickX, 2) + Math.pow(house.y - clickY, 2));
                if (dist < minDist && dist < 20) { // Threshold to ensure click is near a house
                    minDist = dist;
                    closestIdx = idx;
                }
            });

            if (closestIdx !== -1) {
                setStartPoint(closestIdx);
                // Reinitialize path with new start
                const newPath = [closestIdx, ...[0,1,2,3,4].filter(i => i !== closestIdx).sort(() => Math.random() - 0.5)];
                setCurrentPath(newPath);
                setCurrentDistance(calculatePathDistance(newPath, distances));
                setTemperature(initialTemp);
            }
        }
    };

    // Add global mouse move and up listeners for house dragging
    useEffect(() => {
        window.addEventListener('mousemove', handleCanvasMouseMove);
        window.addEventListener('mouseup', handleCanvasMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleCanvasMouseMove);
            window.removeEventListener('mouseup', handleCanvasMouseUp);
        };
    }, [draggingHouse, dragOffset, houses, distances, startPoint]);

    // Handle mouse down on panel navbar to start dragging
    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        // Only start dragging if the target is the navbar
        if ((event.target as HTMLElement).className.includes('draggable-navbar')) {
            setIsDraggingPanel(true);
            setDragOffset({
                x: event.clientX - panelPosition.x,
                y: event.clientY - panelPosition.y
            });
        }
    };

    // Handle mouse move to update panel position
    const handleMouseMove = (event: MouseEvent) => {
        if (isDraggingPanel) {
            setPanelPosition({
                x: event.clientX - dragOffset.x,
                y: event.clientY - dragOffset.y
            });
        }
    };

    // Handle mouse up to stop dragging panel
    const handleMouseUp = () => {
        setIsDraggingPanel(false);
    };

    // Add global mouse move and up listeners for panel dragging
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingPanel, dragOffset]);

    // Draw on canvas whenever houses, path, or distances change
    useEffect(() => {
        if (canvasRef.current && houses.length > 0) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw all connections in gray
            ctx.strokeStyle = 'gray';
            ctx.lineWidth = 1;
            for (let i = 0; i < 5; i++) {
                for (let j = i + 1; j < 5; j++) {
                    ctx.beginPath();
                    ctx.moveTo(houses[i].x, houses[i].y);
                    ctx.lineTo(houses[j].x, houses[j].y);
                    ctx.stroke();

                    // Draw distance in middle
                    const midX = (houses[i].x + houses[j].x) / 2;
                    const midY = (houses[i].y + houses[j].y) / 2;
                    ctx.fillStyle = 'black';
                    ctx.font = '12px Arial';
                    ctx.fillText(distances[i][j].toString(), midX, midY);
                }
            }

            // Draw selected path in red
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 3;
            for (let i = 0; i < currentPath.length; i++) {
                const from = currentPath[i];
                const to = currentPath[(i + 1) % currentPath.length];
                ctx.beginPath();
                ctx.moveTo(houses[from].x, houses[from].y);
                ctx.lineTo(houses[to].x, houses[to].y);
                ctx.stroke();
            }

            // Draw houses as blue circles, highlight start point in green, dragging house in yellow
            houses.forEach((house, idx) => {
                ctx.fillStyle = idx === startPoint ? 'green' : (idx === draggingHouse ? 'yellow' : 'blue');
                ctx.beginPath();
                ctx.arc(house.x, house.y, 10, 0, 2 * Math.PI);
                ctx.fill();
                // Label house number
                ctx.fillStyle = 'white';
                ctx.font = '12px Arial';
                ctx.fillText((idx + 1).toString(), house.x - 5, house.y + 5);
            });
        }
    }, [houses, currentPath, distances, startPoint, draggingHouse]);

    // Function to handle iteration speed change
    const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSpeed = parseInt(event.target.value);
        setIterationSpeed(newSpeed);
    };

    return (
        <>
            <Navbar setPageName={(e) => setPageName(e)}></Navbar>
            <div style={{ position: 'relative' }}>
                <canvas ref={canvasRef} style={{ display: 'block' }} onClick={handleCanvasClick} onMouseDown={handleCanvasMouseDown}></canvas>
                {/* Draggable control panel */}
                <div style={{
                    position: 'absolute',
                    left: `${panelPosition.x}px`,
                    top: `${panelPosition.y}px`,
                    background: 'white',
                    padding: '0 10px 10px 10px',
                    border: '1px solid black',
                    zIndex: 10,
                    userSelect: 'none'
                }} onMouseDown={handleMouseDown}>
                    <div
                        className="draggable-navbar"
                        style={{
                            background: '#4a4a4a',
                            color: 'white',
                            padding: '5px',
                            textAlign: 'center',
                            cursor: isDraggingPanel ? 'grabbing' : 'grab'
                        }}
                    >
                        Control Panel
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <p>Current Path: {currentPath.map(i => i+1).join(' -> ')} -&gt; {currentPath[0]+1}</p>
                        <p>Total Distance: {currentDistance}</p>
                        <p>Temperature: {temperature.toFixed(2)}</p>
                        <p>Start Point: {startPoint !== null ? startPoint + 1 : 'Not set'}</p>
                        <div style={{ marginTop: '10px' }}>
                            <label>Iteration Speed (ms): </label>
                            <input
                                type="range"
                                min="1"
                                max="2000"
                                step="1"
                                value={iterationSpeed}
                                onChange={handleSpeedChange}
                                style={{ width: '100%' }}
                            />
                            <span>{iterationSpeed} ms</span>
                        </div>
                        <button onClick={initialize} style={{ marginTop: '10px' }} className=" border-2 border-gray-500 rounded-2xl shadow-2xl p-3 hover:bg-gray-200 ease-in-out duration-200">Reset and Randomize</button>
                    </div>
                </div>
            </div>
        </>
    );
}