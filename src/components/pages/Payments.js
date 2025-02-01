import { useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import Modal from "../reUsableCmponent/modal/Modal";
import Pagination from "../Pagination";
import { BiSolidDownArrow } from "react-icons/bi";
import participats from "../../assets/images/participats.png";
import judges from "../../assets/images/judges.png";
import zones from "../../assets/images/zones.png";

import {
  useAddJudgeMutation,
  useBlockJudgeMutation,
  useDeleteJudgeMutation,
  useEditJudgeMutation,
  useGetJudgesQuery,
} from "../../api/judges";
import { useGetZonesListQuery } from "../../api/common";
import { IoIosClose, IoMdCopy } from "react-icons/io";
import FilterPopup from "../reUsableCmponent/filterPopup";
import { PiEyeFill, PiEyeSlashFill } from "react-icons/pi";
import copy from "copy-to-clipboard";
import { LuCopyCheck } from "react-icons/lu";
import JudgeAvatar from "../../assets/images/person-placeholder.png";
import { toast } from "sonner";
import { PaymentTableData, PlansTableData, tableStatus } from "../../constants/tableData";

const Payments = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState([]);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editPopupData, setEditPopupData] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showBlockPopup, setShowBlockPopup] = useState(false);
  const [selectedJudgeId, setSelectedJudgeId] = useState(null);
  const [zonesList, setZonesList] = useState({});
  const [filterZonesList, setFilterZonesList] = useState([]);
  const [selectedZones, setSelectedZones] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState("");
  const limit = 10;
  const isLoading=false

//   const { data, isLoading, refetch } = useGetJudgesQuery({
//     limit,
//     page: currentPage,
//     search: searchValue,
//     zones: selectedZones,
//   });
  // const { data: zoneList, refetch: ZoneListsRefetch } = useGetZonesListQuery();
  const [addJudge, { isLoading: isLoadingMutation }] = useAddJudgeMutation({});
  const [deleteJudge, { isLoading: isLoadingDelete }] =
    useDeleteJudgeMutation();
  const [EditJudge, { isLoading: isLoadingEdit }] = useEditJudgeMutation();
  const [blockJudge, { isLoading: isLoadingBlock }] = useBlockJudgeMutation();

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // useEffect(() => {
  //   ZoneListsRefetch();
  // }, []);

  const onSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    const formData = new FormData(event.target);
    const isMain = !!formData?.get("isMain");

    if (!zonesList || !zonesList.value) {
      toast.warning("Please select a zone", {
        position: "top-right",
        duration: 2000,
        style: {
          backgroundColor: "#e9c70b", // Custom red color for error
          color: "#FFFFFF", // Text color
        },
        dismissible: true,
      });
      return; // Stop the form from submitting if no zone is selected
    }

    formData?.append("zone", zonesList?.value);
    formData?.set("isMain", isMain);

    try {
      if (editPopupData) {
        formData?.append("judgeId", editPopupData?._id);
        const res = await EditJudge?.(formData);
        if (res?.data?.success) {
         //  refetch();
          // ZoneListsRefetch();
          setZonesList({});
          toggleModal();
          setEditPopupData(null);
        } else {
          toast.error(res.data.message, {
            position: "top-right",
            duration: 2000,
            style: {
              backgroundColor: "#fb0909", // Custom green color for success
              color: "#FFFFFF", // Text color
            },
            dismissible: true,
          });
        }
      } else {
        const res = await addJudge?.(formData);
        if (res?.data?.success) {
         //  refetch();
          // ZoneListsRefetch();
          setZonesList({});
          toggleModal();
        } else {
          toast.error(res.data.message, {
            position: "top-right",
            duration: 2000,
            style: {
              backgroundColor: "#fb0909", // Custom green color for success
              color: "#FFFFFF", // Text color
            },
            dismissible: true,
          });
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleEditClick = (judge) => {
    toggleModal();
    setEditPopupData(judge);
    setZonesList({ value: judge?.zone?._id, label: judge?.zone?.name });
    setImageUrl(judge?.image);
  };

  const handleDeleteClick = (id) => {
    setShowDeletePopup(true);
    setSelectedJudgeId(id);
  };
  const handleDelete = async () => {
    try {
      const body = {
        judgeId: selectedJudgeId,
      };
      const deleteres = await deleteJudge?.(body);
      if (deleteres?.data?.success) {
       //  refetch();
        setSelectedJudgeId(null);
        setShowDeletePopup(false);
      } else {
        toast.error(deleteres.data.message, {
          position: "top-right",
          duration: 2000,
          style: {
            backgroundColor: "#fb0909", // Custom green color for success
            color: "#FFFFFF", // Text color
          },
          dismissible: true,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleChange = (selectedOptions) => {
    setZonesList(selectedOptions || {});
  };
  const handleFilterChange = (selectedOptions) => {
    setFilterZonesList(selectedOptions || {});
  };

  const handleShowBlockJudgePopup = (id) => {
    setSelectedJudgeId(id);
    setShowBlockPopup(true);
  };

  const handleBlockJudge = async () => {
    try {
      const body = {
        judgeId: selectedJudgeId,
      };
      const deleteres = await blockJudge?.(body);
      if (deleteres?.data?.success) {
       //  refetch();
        setShowBlockPopup(false);
      } else {
        toast.error(deleteres.data.message, {
          position: "top-right",
          duration: 2000,
          style: {
            backgroundColor: "#fb0909", // Custom green color for success
            color: "#FFFFFF", // Text color
          },
          dismissible: true,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleModalClose = () => {
    setImageUrl(null);
    setZonesList({});
    toggleModal();
    setEditPopupData(null);
  };

  const handleDeleteModalClose = () => {
    setShowDeletePopup(false);
  };
  const handleBlockModalClose = () => {
    setShowBlockPopup(false);
  };

  const handleSearchChange = useDebouncedCallback(
    // function
    (value) => {
      setSearchValue(value ?? "");
    },
    500
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviewImage = (e) => {
    // Handle image upload if the image file is selected
    const imageFile = e.target.files[0]; // Access the selected image file
    if (imageFile && imageFile.size <= 5 * 1024 * 1024) {
      // Check if it's valid
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    } else {
      // Optionally, you could show an error toast here
      toast.warning("Please select a valid image file (less than 5 MB).", {
        position: "top-right",
        duration: 2000,
        style: {
          backgroundColor: "#e5cc0e", // Custom red color for error
          color: "#FFFFFF", // Text color
        },
        dismissible: true,
      });
      return; // Exit the function if there's no valid image
    }
  };

  // const selectOption = zoneList?.zones?.map((zone) => {
  //   return { value: zone?._id, label: zone?.name };
  // });

  const toggleFilterPopup = () => {
    setIsFilterPopupOpen(!isFilterPopupOpen);
  };
  const handleRemoveZone = (zonesToRemove) => {
    setFilterZonesList(
      filterZonesList.filter((zone) => zone.value !== zonesToRemove.value)
    );
  };

  const handleFilterClick = () => {
    setSelectedZones(filterZonesList?.map((zone) => zone?.value));
    toggleFilterPopup();
  };

  const handleShowPassword = (id) => {
    if (showPassword?.includes(id)) {
      setShowPassword(showPassword?.filter((filterId) => filterId !== id));
    } else {
      setShowPassword([...showPassword, id]);
    }
  };

  const handleCopy = async (value) => {
    setCopied(value);
    copy(value);
    setTimeout(() => {
      setCopied("");
    }, 2000);
  };
  const dashboardData = [
    {
      logo: zones,
      count: 234,
      title: "Items",
    },
    {
      logo: judges,
      count: 39,
      title: "Orders",
    },
    {
      logo: participats,
      count: 3,
      title: "Current Offers",
    },
  ];

  return (
    <>
      <div className="flex rounded-lg p-4 pb-0">
      <div className="w-full grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {dashboardData?.map((ele, index) => (
            <div className="bg-white p-6 rounded-2xl flex items-center space-x-3 justify-between shadow-md border border-gray-300">
              <div className="flex flex-col ">
                <h2 className="text-3xl font-semibold">{ele?.count}</h2>

                <p className=" text-black ">{ele?.title}</p>
              </div>{" "}
              <div>
                <img src={ele?.logo} className="h-12 w-12 object-contain" />
              </div>
            </div>
          ))}
        </div>
       
        <div className="ml-auto flex items-center space-x-4">
          <span className="flex items-center">
            {/* <span
              className="bg-[#808080] hover:bg-[#F8BF40] text-white rounded-3xl pt-2 pb-2 pl-4 pr-4 cursor-pointer"
              onClick={toggleModal}>
              Add New Table
            </span> */}

            <Modal
              isVisible={isModalVisible}
              onClose={handleModalClose}
              modalHeader={editPopupData ? "Edit Table" : "Add New Table"}>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700">
                      Table No.
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="mt-1 block w-full border-2 p-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Item name"
                      required
                      defaultValue={
                        editPopupData?.name ? editPopupData?.name : ""
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="zone"
                      className="block text-sm font-medium text-gray-700">
                      Section
                    </label>
                    <Select
                      className="border-gray-400"
                      options={[]}
                      onChange={handleChange}
                      value={zonesList}
                      isMulti={false}
                      // hideSelectedOptions
                      closeMenuOnSelect={true} // Keep the dropdown open for multiple selections
                      placeholder="Select Floor"
                      components={{ MultiValue: () => null }} // Hide selected options in input
                    />
                    {/* <div className="pt-2">
                      {zonesList.length > 0 && (
                        <ul className="flex flex-wrap gap-1">
                          {zonesList.map((zone) => (
                            <li
                              key={zone.value}
                              className="bg-[#000000] flex items-center justify-between text-white rounded-full py-0.5 px-2 text-xs font-light"
                            >
                              <span>{zone.label}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveZone(zone)}
                                className="ml-2"
                              >
                                <IoIosClose className="text-lg" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div> */}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700">
                      Type  
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="mt-1 block w-full border-2 p-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Email address"
                      required
                      defaultValue={
                        editPopupData?.email ? editPopupData?.email : ""
                      }
                    />
                  </div> */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700">
                      Orders
                    </label>
                    <input
                      type="number"
                      name="phone"
                      id="phone"
                      className="mt-1 block w-full border-2 p-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter Seats"
                      required
                      defaultValue={
                        editPopupData?.phone ? editPopupData?.phone : ""
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
               
                  <div>
                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-700">
                        Action
                      </label>
                      <select
                        name="gender"
                        id="gender"
                        className="mt-1 block w-full border-2 p-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        defaultValue={
                          editPopupData?.gender ? editPopupData?.gender : ""
                        }>
                        <option value="male">AC</option>
                        <option value="female">Non-Ac</option>
                      </select>
                    </div>
                        
                  </div>
                </div>
                {/* <div className="flex flex-row">
                  <input
                    type="checkbox"
                    name="isMain"
                    id="isMain"
                    className="mr-2 border-2 p-1 border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    defaultChecked={
                      editPopupData ? editPopupData?.isMain : false
                    }
                  />
                  <label className="block text-m font-medium text-gray-700">
                    Main Judge
                  </label>
                </div> */}
                <div className="flex justify-center p-6">
                  <button
                    disabled={isLoadingMutation || isLoadingEdit}
                    type="submit"
                    className="bg-[#808080] hover:bg-[#F8BF40] text-white font-bold py-2 px-6 rounded-3xl">
                    {isLoadingMutation || isLoadingEdit
                      ? "loading..."
                      : "Submit"}
                  </button>
                </div>
              </form>
            </Modal>
            <Modal isVisible={showDeletePopup} onClose={handleDeleteModalClose}>
              <h3 className="flex self-center text-lg font-bold">
                Are you sure want to Delete?
              </h3>
              <div className="flex justify-center p-6">
                <button
                  onClick={handleDeleteModalClose}
                  type="submit"
                  className="border border-green-500 text-green-600 hover:bg-green-700 hover:text-white font-bold  py-2 m-2 px-8 rounded-2xl">
                  No
                </button>
                <button
                  disabled={isLoadingDelete}
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 m-2 px-8 rounded-2xl">
                  YES
                </button>
              </div>
            </Modal>
            <Modal isVisible={showBlockPopup} onClose={handleBlockModalClose}>
              <h3 className="flex self-center text-lg font-bold">
                Are you sure want to Block/Unblock?
              </h3>
              <h6 className="flex self-center text-sm text-red-500">
                Judges cannot be unblocked while the competition is live.
              </h6>
              <div className="flex justify-center p-6">
                <button
                  disabled={isLoadingBlock}
                  onClick={handleBlockModalClose}
                  type="submit"
                  className="border border-green-500 text-green-600 hover:bg-green-700 hover:text-white font-bold  py-2 m-2 px-8 rounded-2xl">
                  No
                </button>
                <button
                  disabled={isLoadingBlock}
                  onClick={handleBlockJudge}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 m-2 px-8 rounded-2xl">
                  {isLoadingBlock ? "loading" : "YES"}
                </button>
              </div>
            </Modal>
          </span>
        </div>
      </div>
      <div>
        <div className="flex rounded-lg p-4 pr-0 pt-0">
             <h2 style={{alignSelf:"self-start",marginTop:"10px"}} className="text-2xl font-semibold text-gray-700">Reports</h2>
          <div className="ml-auto lg:mr-4 flex items-center space-x-4 justify-end pt-3">
            {/* Parent div for span elements */}
            {/* <span className="flex items-center justify-center">
              <input
                onChange={(e) => {
                  handleSearchChange(e.target.value);
                }}
                className="p-2 lg:w-[250px] w-full appearance-none bg-white border border-gray-400 rounded-3xl"
                placeholder="Search by name"
              />
            </span> */}
            {/* <span className="flex items-center">
              <span className="cursor-pointer bg-[#808080] hover:bg-[#F8BF40] text-white p-2 lg:w-[100px] text-center rounded-3xl">
                Search
              </span>
            </span> */}
          </div>
        </div>
      </div>

      <table className="min-w-full table-auto mt-6">
        <thead className="bg-white border-gray-400 border-t-[2px] border-l-[2px] border-r-[2px] border-b-[2px]">
          <tr>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Sl No
            </th>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Date
            </th>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Section
            </th>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Orders
            </th>

            <th className="px-4 py-4 text-left border-r border-gray-400">
              Status
            </th>
            <th className="px-4 py-4 text-left border-r border-gray-400">
              Action
            </th>
            {/* <th className="px-4 py-4 text-left">Action</th> */}
          </tr>
        </thead>
        <tbody className="border-[2px] border-opacity-50 border-[#969696]">
          {isLoading ? (
            <>Loading...</>
          ) : (
                    tableStatus?.map((judge, index) => (
              <tr
                className="odd:bg-[#FCD199] even:bg-grey border-[2px] border-opacity-50 border-[#9e9696]"
                key={index}
              >
                <td
                  // onClick={() => navigate(`/judges/${judge?.}`)}
                  className="px-4 py-2 border-r border-gray-400"
                >
                  {index + 1}
                </td>
                <td
                  // onClick={() => navigate(`/judges/${judge?._id}`)}
                  className="px-4 py-2 border-r border-gray-400"
                >
                  <u
                    style={{ cursor: "pointer" }}
                    onMouseOver={({ target }) => (target.style.color = "blue")}
                    onMouseOut={({ target }) => (target.style.color = "black")}
                  >
                    {"12-03-2024-12-02-2024"}
                  </u>
                </td>
                <td
                  // onClick={() => navigate(`/judges/${judge?._id}`)}
                  className="px-4 py-2 border-r border-gray-400"
                >
                  {"Offer"}
                </td>
              
                
                <td className="px-4 py-2 border-r border-gray-400">
                  <ul className="list-disc pl-5 space-y-1">
                   {3*index+522}
                  </ul>
                </td>
                <td className="px-4 py-2 border-r border-gray-400">
                  {judge?.status}
                </td>
                <td className="px-4 py-2 border-r border-gray-400">
                <button>
                    <img
                      alt="pics"
                      src="/icons/export.svg"
                      className="w-6 h-6 rounded-full mr-2"
                    />   {"Export"}
                  </button>
             
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="m-auto flex justify-end ">
        <Pagination
          itemsPerPage={limit}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={PlansTableData?.length}
        />
      </div>
    </>
  );
};

export default Payments;
 