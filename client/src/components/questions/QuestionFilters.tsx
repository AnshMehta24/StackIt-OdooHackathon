import { Button } from "@/components/ui/button";

interface QuestionFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { id: "newest", label: "Newest", description: "Most recently asked" },
  { id: "trending", label: "Trending", description: "Popular this week" },
];

const QuestionFilters = ({
  activeFilter,
  onFilterChange,
}: QuestionFiltersProps) => {
  return (
    <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.id)}
          className={`whitespace-nowrap transition-all ${
            activeFilter === filter.id
              ? "bg-primary text-foreground shadow-sm"
              : "hover:bg-muted"
          }`}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default QuestionFilters;
