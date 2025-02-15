import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import { Form, FormControl, FormField } from "@/components/ui/form";

interface DatatableSearchProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}

const DatatableSearch: React.FC<DatatableSearchProps> = ({
  search,
  setSearch,
  isLoading,
}) => {
  const form = useForm({
    defaultValues: {
      search: "",
    },
  });
  const searchValue = form.watch("search");

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        if (value !== search) {
          setSearch(value);
        }
      }, 1000),
    [setSearch, search],
  );

  const updateSearch = useCallback(
    (newValue: string) => {
      debouncedSearch(newValue);
    },
    [debouncedSearch],
  );

  useEffect(() => {
    updateSearch(searchValue);
  }, [search, searchValue, updateSearch]);

  return (
    <Form {...form}>
      <FormField
        name="search"
        render={({ field }) => (
          <FormControl>
            <Input
              placeholder="Pesquisar"
              className="w-full md:w-auto"
              value={field.value}
              onChange={field.onChange}
              disabled={isLoading}
            />
          </FormControl>
        )}
      />
    </Form>
  );
};

export default DatatableSearch;
