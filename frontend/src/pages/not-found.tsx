import { LandingLayout } from "@/layouts";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <LandingLayout>
      <section className="main">
        <div className="flex flex-col items-center justify-center py-20 space-y-10">
          <div className="space-y-4 text-center">
            <h1 className="text-7xl font-space text-primary-2 font-bold">
              404
            </h1>
            <p className="text-lg text-muted">
              The page you are looking for does not exist.
            </p>
          </div>
          <div>
            <Link to="/" className="btn btn-primary px-6 py-3 rounded-full">
              <ArrowLeft size={20} />
              Go Home
            </Link>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
