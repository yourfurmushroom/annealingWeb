'use client';

import { useState } from 'react';
import Button from './Button'; // 假設你已經有 Button 元件

export default function Navbar({ setPageName }: { setPageName: (s: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="relative w-full bg-gray-50 dark:bg-gray-800 py-3">
            <div className=' px-4'>
                <div className="flex items-center justify-between sm:justify-start">

                    <Button Action={() => { }} className="text-black text-[24px]" title="排班小助手" disabled={false} />
                    <Button Action={() => setIsOpen(!isOpen)} className="sm:hidden text-black text-xl right-0" title="☰" disabled={false}/>

                    <div className="hidden sm:flex items-center gap-x-6 px-4">
                        <Button Action={() => setPageName("Dashboard")} className="text-gray-500 text-[20px]" title="儀表板" disabled={false}/>
                        <Button Action={() => setPageName("yourShifts")} className="text-gray-500 text-[20px]" title="你的排班" disabled={false} />
                        <Button Action={() => {console.log("aaa");setPageName("Digital")}} className="text-gray-500 text-[20px]" title="數位退火小遊戲" disabled={false}/>
                        <Button Action={() => setPageName("Quantum")} className="text-gray-500 text-[20px]" title="量子退火小遊戲" disabled={false}/>     
                    </div>
                </div>

            </div>
            {isOpen && (
                <div className="absolute inset-x-0 top-full bg-gray-50  flex flex-col sm:hidden py-4 gap-y-2 shadow-md z-50">
                    <Button Action={() => setPageName("Dashboard")} className="text-gray-500 text-[20px] w-[95%]" title="儀表板" disabled={false}/>
                    <Button Action={() => setPageName("YourShifts")} className="text-gray-500 text-[20px] w-[95%]" title="你的排班" disabled={false}/>
                    <Button Action={() => setPageName("Digital")} className="text-gray-500 text-[20px] w-[95%]" title="數位退火小遊戲" disabled={false}/>
                    <Button Action={() => setPageName("Quantum")} className="text-gray-500 text-[20px] w-[95%]" title="量子退火小遊戲" disabled={false}/>
                </div>
            )}

        </nav>
    );
}
 