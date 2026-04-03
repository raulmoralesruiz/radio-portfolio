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
    <section id="demos" className="relative py-24">
      <div className="absolute inset-0 pointer-events-none bg-blue-900/5 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950" />
      
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-wider text-purple-400">Portafolio</span>
          <h2 className="mt-2 mb-4 text-3xl font-bold md:text-5xl">Demos de <span className="text-gradient">Audio</span></h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Escucha una selección de mis últimos proyectos. Solo se reproduce uno a la vez.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
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
