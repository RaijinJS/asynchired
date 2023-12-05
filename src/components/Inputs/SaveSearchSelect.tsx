import { useState, Fragment, useEffect } from "react";
import { api } from "~/utils/api";
import { useFilter } from "~/context/FilterContext";
import { InputSkeleton } from "../InputSkeleton";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

type Search = {
  id: number;
  userId: string;
  name: String;
  title?: string;
  location?: string;
  company?: string;
  jobDescription?: string;
  salary?: string;
  createdAt: string;
  updatedAt: string;
};

export function SaveSearchSelect() {
  const [selectedSearch, setSelectedSearch] = useState<
    Search | { name: string }
  >({
    name: "Select a saved search",
  });

  const { userId } = useAuth();

  const { data: searches, isLoading } = api.search.getSearches.useQuery();
  const filters = useFilter();

  useEffect(() => {
    if (selectedSearch.name !== "Select a saved search") {
      filters.setLocationFilter(selectedSearch.location ?? "");
      filters.setRoleFilter(selectedSearch.title ?? "");
      filters.setCompanyFilter(selectedSearch.company ?? "");
      filters.setDescriptionFilter(selectedSearch.jobDescription ?? "");
    }
  }, [selectedSearch, filters]);

  const resetSelectedSearch = (e) => {
    e.stopPropagation();
    setSelectedSearch({ name: "Select a saved search" });
    filters.setLocationFilter("");
    filters.setRoleFilter("");
    filters.setCompanyFilter("");
    filters.setDescriptionFilter("");
  };

  if (isLoading) {
    return <InputSkeleton />;
  }

  const handleListboxClick = (e) => {
    if (!searches || searches.length === 0 || !userId) {
          e.stopPropagation();

      toast.error("Login & save a search to use this feature", {
        icon: "🔒",
        style: {
          borderRadius: "10px",
          background: "#E61A1A",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="relative flex w-full ">
      <Listbox value={selectedSearch} onChange={setSelectedSearch}>
        {({ open }) => (
          <>
            <Listbox.Button
              onClick={(e) => handleListboxClick(e)}
              className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
            >
              <span
                className={`block truncate py-2 pl-3 pr-10 text-sm leading-5 ${
                  selectedSearch.name === "Select a saved search"
                    ? "text-gray-500"
                    : "text-black"
                }`}
              >
                {selectedSearch.name}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center border-l-2 pr-2">
                <button
                  onClick={(e) => resetSelectedSearch(e)}
                  className="h-8 w-8 cursor-pointer text-gray-400"
                >
                  <XMarkIcon />
                </button>
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                {searches.map((search) => (
                  <Listbox.Option
                    key={search.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-teal-600 text-white" : "text-gray-900"
                      }`
                    }
                    value={search}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {search.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  );
}
