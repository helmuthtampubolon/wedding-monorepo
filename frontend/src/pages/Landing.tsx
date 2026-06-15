import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <p className="font-script text-5xl text-sage">Wedding Invitation</p>
      <h1 className="font-display text-4xl mt-2">Monorepo Demo</h1>
      <p className="mt-4 text-gray-600 max-w-md">
        Backend Laravel + Frontend React. Buka contoh undangan atau masuk ke panel admin.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/i/bobby-krisma" className="px-5 py-2 rounded-full bg-sage text-white">Lihat Contoh</Link>
        <Link to="/admin/login" className="px-5 py-2 rounded-full border border-sage text-sage">Login Admin</Link>
      </div>
    </div>
  );
}
