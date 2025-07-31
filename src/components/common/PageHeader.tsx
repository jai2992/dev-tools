interface PageHeaderProps {
  title: string;
  description: string;
  gradient?: string;
}

export default function PageHeader({ 
  title, 
  description, 
  gradient = 'from-blue-600 via-blue-500 to-indigo-600' 
}: PageHeaderProps) {
  return (
    <header className={`bg-gradient-to-r ${gradient} py-8`}>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-black text-white">{title}</h1>
        <p className="text-lg md:text-xl text-blue-100 mt-2">{description}</p>
      </div>
    </header>
  );
}
