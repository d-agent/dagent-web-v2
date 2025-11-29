import React from 'react';
import Image from 'next/image';
import { ArrowRight, Twitter, Github, Disc } from 'lucide-react';

export const Footer = () => (
    <footer className="border-t border-white/10 bg-black pt-16 pb-8 mt-auto w-full">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
                <div className="flex items-center">
                    <Image 
                        src="/logo-full.png" 
                        alt="Dagent Full Logo" 
                        width={200} 
                        height={70} 
                        className="h-14 w-auto object-contain"
                        priority
                    />
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                    The decentralized layer for autonomous AI agents. Built on Cardano & Masumi.
                </p>
            </div>
            <div>
                <h4 className="font-bold mb-4 text-white">Platform</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                    <li><a href="#" className="hover:text-primary transition-colors">Frameworks</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Agents</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Staking</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Roadmap</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-4 text-white">Resources</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                    <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Masumi Network</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Governance</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold mb-4 text-white">Stay Updated</h4>
                <div className="flex space-x-2 mb-4">
                    <input type="email" placeholder="Enter email" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary w-full" />
                    <button className="bg-primary text-black px-3 rounded-lg hover:bg-primaryDim">
                        <ArrowRight size={16} />
                    </button>
                </div>
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-500 hover:text-white transition-colors"><Twitter size={18} /></a>
                    <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github size={18} /></a>
                    <a href="#" className="text-gray-500 hover:text-white transition-colors"><Disc size={18} /></a>
                </div>
            </div>
        </div>
        <div className="text-center text-gray-600 text-xs pt-8 border-t border-white/5">
            &copy; 2025 Dagent Protocol Foundation. All rights reserved.
        </div>
    </footer>
);
