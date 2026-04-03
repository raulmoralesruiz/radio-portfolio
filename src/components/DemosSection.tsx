import React from 'react';
import AudioPlayer from './AudioPlayer';

const demos = [
  {
    id: 'demo-1',
    category: 'Podcast',
    title: 'Pastora Soler',
    url: '/audio/audio1.mp3',
    duration: '0:21',
  },
  {
    id: 'demo-2',
    category: 'Corporativo',
    title: 'Cajasol',
    url: '/audio/audio2.mp3',
    duration: '0:23',
  },
  {
    id: 'demo-3',
    category: 'Publicidad',
    title: 'Confederación de Empresarios de Cádiz',
    url: '/audio/audio3.mp3',
    duration: '0:23',
  }
];

export default function DemosSection() {
  return (
    <section id="demos" className="py-24 relative">
      <div className="absolute inset-0 bg-blue-900/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-purple-400 font-semibold tracking-wider uppercase text-sm">Portafolio</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4">Demos de <span className="text-gradient">Audio</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Escucha una selección de mis últimos proyectos. Solo se reproduce uno a la vez.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {demos.map((demo) => (
            <AudioPlayer
              key={demo.id}
              id={demo.id}
              title={demo.title}
              url={demo.url}
              duration={demo.duration}
              category={demo.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
