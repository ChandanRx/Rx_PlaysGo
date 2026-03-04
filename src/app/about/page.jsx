import Image from 'next/image';
import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-black/40 p-6 text-slate-50 shadow-[0_18px_60px_rgba(0,0,0,0.75)] backdrop-blur md:p-10">
          
          <h2 className="mb-6 text-center text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
            About the creator
          </h2>
          <section className="mb-8 flex flex-col items-center">
            
            <Image
              src="/about.jpg"
              alt="Your Name"
              width={40}
              height={40}
              className="mb-4 h-32 w-32 rounded-full border border-white/15 object-cover md:h-40 md:w-40"
            />
            <p className="mb-4 text-sm leading-relaxed text-slate-300 md:text-lg">
              Hello! I'm Chandan Pargi, the creator of <strong>Plays Go</strong>. I built this platform to help gamers find and connect with other players for their favorite games. Whether you're looking for teammates, players for a match, or want to share your gaming experience, Plays Go is here to help!
            </p>
          </section>

          <section className="mb-8">
            <h3 className="mb-3 text-xl font-semibold text-amber-300 md:text-2xl">My development journey</h3>
            <p className="mb-4 text-sm leading-relaxed text-slate-300 md:text-lg">
              My web development journey began during my college years when I started learning the basics of HTML, CSS, and JavaScript. As I explored more, I realized the power of frameworks like React.js and Next.js. I dove deeper into these technologies, and after completing several projects, I wanted to build something that could help others.
            </p>
            <p className="mb-4 text-sm leading-relaxed text-slate-300 md:text-lg">
              Building <strong>Plays Go</strong> was a challenging yet exciting experience. It allowed me to apply everything I had learned and also gave me the opportunity to explore new tools like Firebase and NextAuth for user authentication.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="mb-3 text-xl font-semibold text-amber-300 md:text-2xl">Technologies I used</h3>
            <p className="mb-4 text-sm leading-relaxed text-slate-300 md:text-lg">
              Here are some of the key technologies I used to build <strong>Plays Go</strong>:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300 md:text-base">
              <li>React.js for building the user interface</li>
              <li>Next.js for server-side rendering and routing</li>
              <li>Tailwind CSS for styling and responsive design</li>
              <li>Firebase for database management and authentication</li>
              <li>NextAuth for managing user sessions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="mb-3 text-xl font-semibold text-amber-300 md:text-2xl">Connect with me</h3>
            <p className="mb-4 text-sm leading-relaxed text-slate-300 md:text-lg">
              Feel free to connect with me on any of the platforms below. I would love to hear from you, whether it’s about suggestions for improving Plays Go or just a friendly chat about gaming!
            </p>
            <div className="flex justify-center space-x-8">

              <a
                href="https://github.com/chandanrx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-slate-300 transition-colors hover:text-amber-300"
              >
                <i className="fab fa-github fa-3x"></i>
                <p className="mt-2 text-xs text-slate-300">GitHub</p>
              </a>

              <a
                href="https://www.linkedin.com/in/chandan-pargi-459272187"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-slate-300 transition-colors hover:text-amber-300"
              >
                <i className="fab fa-linkedin fa-3x"></i>
                <p className="mt-2 text-xs text-slate-300">LinkedIn</p>
              </a>

              <a
                href="https://www.youtube.com/@rxn013"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-slate-300 transition-colors hover:text-amber-300"
              >
                <i className="fab fa-youtube fa-3x"></i>
                <p className="mt-2 text-xs text-slate-300">YouTube</p>
              </a>

              <a
                href="https://twitter.com/rxn_13"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-slate-300 transition-colors hover:text-amber-300"
              >
                <i className="fab fa-x-twitter fa-3x"></i>
                <p className="mt-2 text-xs text-slate-300">X (Twitter)</p>
              </a>
            </div>
          </section>


          <section>
            <h3 className="mb-3 text-xl font-semibold text-amber-300 md:text-2xl">Contact me</h3>
            <p className="mb-4 text-sm leading-relaxed text-slate-300 md:text-lg">
              If you'd like to collaborate, discuss a project, or just say hello, feel free to reach out to me via email at: 
              <a href="mailto:your-email@example.com" className="text-amber-300 hover:underline">chandan.rxn@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;
