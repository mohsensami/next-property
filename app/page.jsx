import Link from "next/link";

const HomePage = () => {
  return (
    <div className="text-2xl">
      <div>
        <Link href="/properties">Propery Page</Link>
      </div>
    </div>
  );
};

export default HomePage;
