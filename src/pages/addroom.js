import React, { useState, useEffect } from "react";
import * as XLXS from 'xlsx';

const Addroom = () => {
    const [data,setData] = useState([])
    const [subject_nameTH, setSubject_nameTH] = useState("");
    const [subject_nameEN, setSubject_nameEN] = useState("");
    const [credit, setCredit] = useState(0);
    const [school_year, setSchool_year] = useState("");
    const [subject_id, setSubject_id] = useState("");
    const [type, setType] = useState("");
    const [courseData ,setCourseData] = useState([]);
    const [selectAllCheckbox_open, setSelectAllCheckbox_open] = useState(false);
    const [selectAllCheckbox_delete, setSelectAllCheckbox_delete] = useState(false);


    async function handleImportCourse() {
        try {
            await fetch("http://localhost:4000/course/importCourse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject_id: subject_id,
                    subject_nameEN: subject_nameEN,
                    subject_nameTH: subject_nameTH,
                    credit: credit,
                    type: type,
                    school_year: school_year,
                }),
            });
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        (async function() {
            const res = await fetch("http://localhost:4000/course/getAllCourses");
            const data = await res.json();
            setCourseData(data);
        })();
    }, []);

    // Function to handle select all checkboxes for opening
    const handleSelectAllOpen = () => {
        const updatedData = courseData.map(item => {
            return {
                ...item,
                selected: !selectAllCheckbox_open
            };
        });
        setCourseData(updatedData);
        setSelectAllCheckbox_open(!selectAllCheckbox_open);
    };

    // Function to handle select all checkboxes for deleting
    const handleSelectAllDelete = () => {
        const updatedData = courseData.map(item => {
            return {
                ...item,
                selected: !selectAllCheckbox_delete
            };
        });
        setCourseData(updatedData);
        setSelectAllCheckbox_delete(!selectAllCheckbox_delete);
    };

    const handleFileUpload = (e) => {
        setData([]);
        const reader = new FileReader();
        reader.readAsArrayBuffer(e.target.files[0])
        
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLXS.read(data,{type : "binary"});
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsedData = XLXS.utils.sheet_to_json(sheet);
          setData(parsedData);
        };
      };

    return (
        <div className="ml-28 mx-5 my-5">
            <div className="flex text-3xl font-bold">
                <p>นำเข้าห้องเรียน</p>
            </div>
            <div className="flex flex-row justify-between pt-5 h-90">
                {/* Add Course Form */}
                <form className="bg-from-color p-2 m-2 w-3/5 rounded-lg h-90 text-base">
                    {/* File Input for Course */}
                    <div className="flex flex-col justify-center ">
                        <div className="flex flex-row items-center justify-between">
                            <div className="flex items-center justify-between w-full bg-white rounded-full  p-1.5 m-1.5">
                                <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileUpload}
                                className="rounded-full pl-1 text-sm py-1.5 w-3/4"
                                placeholder="ไฟล์หลักสูตรปีการศึกษา"/>
                            </div>
                        </div>
                    </div>
                    <form  className="bg-white flex m-2 p-2 rounded h-72">
                  {data.length > 0 && (
                    <table className="table-auto">
                      <thead>
                        <tr>
                        {Object.keys(data[0]).map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                          {data.map((row, index) => (
                            <tr key={index}>
                              {Object.values(row).map((value, index) => (
                                <td key={index}>{value}</td>
                              ))}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}

            </form>
                    <div className="flex justify-end pt-2 pr-3">
                        <button className="bg-rose-color font-semibold text-white m-1 p-1 rounded-full w-1/4 hover:bg-red-900 active:bg-neutral-800">
                            อัพโหลด
                        </button>
                    </div>
                </form>
                {/* Add Room Form */}
                <form
                    className="bg-from-color p-2 m-2 w-2/5 rounded-lg h-90 justify-center"
                    onSubmit={handleImportCourse}>
                    {/* Header */}
                    <div className="flex justify-center text-lg font-semibold pt-2">
                        <p>เพิ่มห้องเรียน</p>
                    </div>
                    <div className="flex justify-center">
                        <div className="flex flex-col justify-center text-lg text-base pt-2 w-9/12">
                            {/* Room Number Input */}
                            <div className="flex flex-row justify-between  w-full items-center py-2">
                                <label htmlFor="name">
                                    <p className="pr-1">เลขห้องเรียน</p>
                                </label>
                                <input
                                    type="text"
                                    className="rounded-full p-3 text-sm py-1.5 w-3/5  "
                                    placeholder="เลขห้อง"
                                    onChange={(event) => setSubject_nameTH(event.target.value)}
                                />
                            </div>
                            {/* Number of Students Input */}
                            <div className="flex flex-row justify-between  w-full items-center py-2">
                                <label htmlFor="name">
                                    <p className="pr-1">จำนวนนิสิตที่รับ</p>
                                </label>
                                <input
                                    type="int"
                                    className="rounded-full p-3 text-sm py-1.5 w-3/5  "
                                    placeholder="จำนวนคน"
                                    onChange={(event) => setSubject_nameEN(event.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Submit Button */}
                    <div className="flex justify-end pt-2 pr-3">
                        <button
                            className="bg-rose-color font-semibold text-white m-1 p-1 rounded-full w-1/4 hover:bg-red-900 active:bg-neutral-800"
                            type="submit"
                        >
                            เพิ่ม
                        </button>
                    </div>
                </form>
            </div>
            {/* Table of Courses */}
            <form>
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th>ชื่อห้องเรียน</th>
                            <th>จำนวนนักศึกษา</th>
                            <th>
                                <div className="justify-center items-center">
                                    <div className="flex flex-row">
                                        <button
                                            type='button'
                                            className="p-2 my-2 mx-2 bg-red-300 rounded-lg w-1/2 hover:bg-zinc-500"
                                            onClick={handleSelectAllOpen}
                                        >
                                            เลือกทั้งหมด
                                        </button>
                                        <button
                                            type='button'
                                            className="p-2 my-2 mx-2 rounded-lg bg-yes-color w-1/2 hover:bg-zinc-500"
                                        >
                                            เปิด
                                        </button>
                                    </div>
                                </div>
                            </th>
                            <th>
                                <div className="justify-center items-center">
                                    <div className="flex flex-row">
                                        <button
                                            className="p-2 my-2 mx-2 bg-red-300 rounded-lg w-1/2 hover:bg-zinc-500"
                                            onClick={handleSelectAllDelete}
                                        >
                                            เลือกทั้งหมด
                                        </button>
                                        <button
                                            className="p-2 my-2 mx-2 rounded-lg bg-no-color w-1/2 hover:bg-zinc-500"
                                        >
                                            ลบ
                                        </button>
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            courseData.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <p>{item.subject_nameTH}</p>
                                    </td>
                                    <td>
                                        <p>{item.subject_nameEN}</p>
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="accent-rose-color w-7 h-7"
                                            checked={item.selected || false}
                                            onChange={() => {
                                                const updatedData = courseData.map((course) => {
                                                    if (course.id === item.id) {
                                                        return {
                                                            ...course,
                                                            selected: !item.selected
                                                        };
                                                    }
                                                    return course;
                                                });
                                                setCourseData(updatedData);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className="accent-rose-color w-7 h-7"
                                            checked={item.selected || false}
                                            onChange={() => {
                                                const updatedData = courseData.map((course) => {
                                                    if (course.id === item.id) {
                                                        return {
                                                            ...course,
                                                            selected: !item.selected
                                                        };
                                                    }
                                                    return course;
                                                });
                                                setCourseData(updatedData);
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </form>
        </div>
    );
};

export default Addroom;