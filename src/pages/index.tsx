import Head from "next/head";
import Image from "next/image";
import { CompanyInputBox } from "~/components/Inputs/CompanyInputBox";
import { LocationInputBox } from "~/components/Inputs/LocationInputBox";
import { RoleInputBox } from "~/components/Inputs/RoleInputBox";
import { MinSalaryInputBox } from "~/components/Inputs/minSalaryInputBox";
import JobList from "~/components/jobLists/JobList";
import { NavBar } from "~/components/NavBar";
import { useFilter } from "~/context/FilterContext";
import ScrollToTopButton from "~/components/Buttons/scrollToTopButton";
import { useAuth } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { DateInputBox } from "~/components/Inputs/DateInputBox";
import { TagWidget } from "~/components/Inputs/Tags/Tags";
import { useModal } from "~/context/modalContext";
import { SaveSearcNameModal } from "~/components/SavedSearches/saveSearchNameModal";
import toast from "react-hot-toast";
import { SaveSearchSelect } from "~/components/Inputs/SaveSearchSelect";

export default function Home() {
  const { roleFilter, locationFilter, companyFilter } = useFilter();
  const { userId } = useAuth();
  const [isOpen, setIsOpen] = useModal("saveSearchName");

  const mutation = api.search.saveSearch.useMutation();
  const { refetch } = api.search.getSearches.useQuery();

  const handleSaveSearch = (e: React.MouseEvent, searchName: string) => {
    e.preventDefault();

    if (searchName === "") {
      toast.error("Name required", {
        icon: "📝",
        style: {
          borderRadius: "10px",
          background: "#E61A1A",
          color: "#fff",
        },
      });
      return;
    } else {
      setIsOpen(false);

      if (!userId) return;

      mutation.mutate(
        {
          searchName,
          userId,
          title: roleFilter,
          location: locationFilter,
          company: companyFilter,
        },
        {
          onSuccess: () => {
            toast.success("Search saved", {
              icon: "📝",
              style: {
                borderRadius: "10px",
                background: "#10B981",
                color: "#fff",
              },
            });
            refetch().catch((error) => {
              console.error("Failed to refetch: ", error);
            });
          },
        },
      );
    }
  };

  return (
    <>
      <Head>
        <title>Async Hired - All the jobs & jobs for all!</title>
        <meta name="description" content="All developer jobs in one place" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="pb-6">
        <div className="flex h-[34rem] w-full flex-col bg-black bg-opacity-50 md:h-[500px] md:bg-transparent">
          <div className="absolute -z-10 h-[34rem] w-full md:h-[500px]">
            <Image
              src={"/hero-bg-2.png"}
              layout="fill"
              alt="Hero Section Background"
              priority={true}
              style={{ objectFit: "cover", objectPosition: "50% 10%" }}
            />
          </div>
          <NavBar />
          <div className="relative left-1/2 top-[40%] mr-2 max-w-fit -translate-x-2/4 -translate-y-2/4 rounded-lg md:bg-black md:bg-opacity-70 md:px-4 md:py-10">
            <h1 className="mb-4 text-center text-2xl text-white md:text-4xl">
              All the dev jobs,
              <span className="font-semibold"> one place</span>
            </h1>
            {userId && (
              <div className="mb-4 flex w-full items-center justify-center px-4 text-center text-white md:text-left">
                <SaveSearchSelect />
                <button
                  type="button"
                  className="ml-2 w-max rounded-md bg-[#1A78E6] p-1 font-semibold text-white  hover:bg-blue-600"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <Image
                    src={"save.svg"}
                    height={34}
                    width={34}
                    alt="save search button"
                  />
                </button>
                <SaveSearcNameModal handleSaveSearch={handleSaveSearch} />
              </div>
            )}
            <div className="flex w-full justify-center px-4">
              <form className="flex flex-col items-center justify-center md:flex-row md:gap-4">
                <div className="mb-4 flex flex-col gap-2 md:mb-0 md:flex-row">
                  <div className="flex flex-col">
                    <span className="mr-2 font-bold text-white">
                      I'm looking for
                    </span>
                    <RoleInputBox />
                  </div>
                  <div className="flex grow flex-col">
                    <span className="mr-2 font-bold text-white">In</span>
                    <LocationInputBox />
                  </div>
                  <div>
                    <span className="mr-2 font-bold text-white">At</span>
                    <div className="flex grow">
                      <CompanyInputBox />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex w-full flex-col items-end gap-8 px-4 md:flex-row">
              <div className="flex justify-center ">
                <DateInputBox />
              </div>
              <div className="flex justify-center">
                <MinSalaryInputBox />
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${"h-auto w-full opacity-100"}`}
          >
            <TagWidget />
          </div>
        </div>

        <div>
          <JobList />
        </div>
        <ScrollToTopButton />
      </main>
    </>
  );
}
