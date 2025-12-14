import { DiscoveryMode, FilterPanel, MovieDetailModal, MovieGrid, SortSelect } from '@/components';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Movie Discovery</h1>
          <p className="mt-2 text-gray-400">Explore and discover movies from TMDB</p>
        </header>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full flex-shrink-0 lg:w-72">
            <div className="sticky top-4 flex flex-col gap-4">
              <DiscoveryMode />
              <FilterPanel />
            </div>
          </aside>

          {/* Main Content */}
          <section className="flex-1">
            <div className="mb-4 flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between">
              <h2 className="text-lg font-semibold text-white">Movies</h2>
              <SortSelect />
            </div>
            <MovieGrid />
          </section>
        </div>
      </div>

      {/* Modal */}
      <MovieDetailModal />
    </main>
  );
}
