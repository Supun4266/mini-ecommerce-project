import React from "react";
import firstimage from "../assets/1.png";   // adjust path as needed
import secondimage from "../assets/2.png";   // adjust path as needed
import thirdimage from "../assets/3.png";   // adjust path as needed
import fourthimage from "../assets/4.png";   // adjust path as needed
import fifthimage from "../assets/5.png";   // adjust path as needed
import sixthimage from "../assets/6.png";   // adjust path as needed
import seventhimage from "../assets/7.png";   // adjust path as needed
import lastimage from "../assets/8.png";   // adjust path as needed
import logo from "../assets/logo.png";   // adjust path as needed
import { Bell } from "lucide-react";


export default function BrowsePage() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7edf4] px-10 py-3">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-[#0d141c]">
                     <div className="flex items-center gap-2 font-bold text-xl">
                       <img src={logo} alt="logo" className="w-10" />
                       <span>EduLearn</span>
                     </div>
  
            </div>
            <div className="flex items-center gap-9">
              <a className="text-[#0d141c] text-sm font-medium leading-normal" href="#">
                Home
              </a>
              <a className="text-[#0d141c] text-sm font-medium leading-normal" href="#">
                My Courses
              </a>
              <a className="text-[#0d141c] text-sm font-medium leading-normal" href="#">
                Instructors
              </a>
             
            </div>
          </div>

          <div className="flex flex-1 justify-end gap-8 items-center">
            <label className="flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-[#49739c] flex border-none bg-[#e7edf4] items-center justify-center pl-4 rounded-l-lg border-r-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                  </svg>
                </div>
                <input
                  placeholder="Search"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141c] focus:outline-0 focus:ring-0 border-none bg-[#e7edf4] h-full placeholder:text-[#49739c] px-4 rounded-l-none pl-2 text-base font-normal leading-normal"
                  defaultValue=""
                />
              </div>
            </label>

            <div className="flex gap-2 items-center">
             <button className="bg-gray-100 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-200 transition">
      <Bell className="w-5 h-5 text-gray-700" />
    </button>
             
            </div>

            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD8Py44jLtIhnved91AB50jO-DP8_n3_5AZAnMzQJ8rCI_zKIM7PBLeqmgH0No8StUtjyGMKCKI79KK_PExoMFqENpNLP5wadJexsq6Vkv6iUSi-WKDQFJ7sEx0bePjzuIxDi6WQFnxbmNwb929vMni-3BffxxDGISIXwzQDRwLr4rmvpcVnEGS-zpNpaP7Lz6kaykxjmVP0qG7crhxXnLXvfoxwrwe9tXilqu6movpulVN84QlnEHFmtc35GrJDKdfJtfD8IP4J3cT")',
              }}
            ></div>
          </div>
        </header>

        {/* Content */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <h2 className="font-bold text-2xl text-gray-800l px-3 py-2 -mt-8">Browse Courses</h2>
                <p className="text-blue-600 px-3 py-2 -mt-3">Explore our extensive library of courses to find the perfect fit for your learning journey.</p>
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  
                  <div className="text-[#49739c] flex border-none bg-[#e7edf4] items-center justify-center pl-4 rounded-l-lg border-r-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                    </svg>
                  </div>
                  <input
                    placeholder="Search for products"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d141c] focus:outline-0 focus:ring-0 border-none bg-[#e7edf4] h-full placeholder:text-[#49739c] px-4 rounded-l-none pl-2 text-base font-normal leading-normal px-4 py-3 "
                    defaultValue=""
                  />
                </div>
              </label>
            </div>

           <div className="p-8 max-w-7xl mx-auto">
      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap ">
        <select className="border rounded px-3 py-2 ">
          <option >Subject</option>
        </select>
        <select className="border rounded px-3 py-2">
          <option>Difficulty</option>
        </select>
        <select className="border rounded px-3 py-2">
          <option>Price</option>
        </select>
        <select className="border rounded px-3 py-2">
          <option>Rating</option>
        </select>
      </div>

      {/* Search + View Toggle */}
      <div className="flex items-center justify-between mb-6">
       
        <div className="flex gap-2 ml-4">
        <button className="px-6 py-1 rounded bg-gray-200 w-140">
  Grid
</button>
<button className="px-6 py-1 rounded border w-120">
  List
</button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
          <img
            src={firstimage}
            alt="Intro to Data Science"
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg">Introduction to Data Science</h3>
            <p className="text-blue-600 text-sm mt-1">
              Learn the basics of data analysis and visualization.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
          <img
            src={secondimage}
            alt="Advanced Python"
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg">Advanced Python Programming</h3>
            <p className="text-blue-600 text-sm mt-1">
              Master advanced Python concepts and techniques.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
          <img
            src={thirdimage}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg">Digital Marketing Fundamentals</h3>
            <p className="text-blue-600 text-sm mt-1">
              Understand the core principles of digital marketing.
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
          <img
            src={fourthimage}
            alt="Creative Writing"
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg">Creative Writing Workshop</h3>
            <p className="text-blue-600 text-sm mt-1">
              Develop your creative writing skills with expert guidance.
            </p>
          </div>
        </div>

        {/* Card 5 */}
        <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
          <img
            src={fifthimage}
            alt="ML"
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg">Machine Learning with TensorFlow</h3>
            <p className="text-blue-600 text-sm mt-1">
              Explore machine learning algorithms using TensorFlow.
            </p>
          </div>
        </div>

        {/* Card 6 */}
        <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
          <img
            src={sixthimage}
            alt="Accounting"
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg">Financial Accounting Basics</h3>
            <p className="text-blue-600 text-sm mt-1">
              Learn the fundamentals of financial accounting.
            </p>
          </div>
        </div>

        {/* Card 7 */}
        <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
          <img
            src={seventhimage}
            alt="Design"
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg">Graphic Design Essentials</h3>
            <p className="text-blue-600 text-sm mt-1">
              Create stunning graphics and visual designs.
            </p>
          </div>
        </div>

        {/* Card 8 */}
        <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
          <img
            src={lastimage}
            alt="PM"
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg">Project Management Professional</h3>
            <p className="text-blue-600 text-sm mt-1">
              Gain essential project management skills.
            </p>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button className="px-3 py-1 border rounded">1</button>
        <button className="px-3 py-1 border rounded">2</button>
        <button className="px-3 py-1 border rounded">3</button>
        <button className="px-3 py-1 border rounded">4</button>
        <button className="px-3 py-1 border rounded">5</button>
      </div>
    </div>

            <div id="product-grid" className="grid grid-cols-4 gap-3 p-4"></div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-center">
          <div className="flex max-w-[960px] flex-1 flex-col">
            <div className="flex flex-col gap-6 px-5 py-10 text-center">
              <div className="flex flex-wrap items-center justify-center gap-6">
                <a className="text-[#49739c] text-base font-normal leading-normal min-w-40" href="#">
                  About Us
                </a>
                <a className="text-[#49739c] text-base font-normal leading-normal min-w-40" href="#">
                  Contact
                </a>
                <a className="text-[#49739c] text-base font-normal leading-normal min-w-40" href="#">
                  Privacy Policy
                </a>
                <a className="text-[#49739c] text-base font-normal leading-normal min-w-40" href="#">
                  Terms of Service
                </a>
              </div>
              <p className="text-[#49739c] text-base font-normal leading-normal">
                @2024 ShopAll. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

