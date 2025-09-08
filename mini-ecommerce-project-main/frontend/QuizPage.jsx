import React from "react";
import logo from "../assets/logo.png"
import { Bell } from "lucide-react";

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-gray shadow">
        <div className="flex items-center gap-2 font-bold text-xl">
          <img src={logo} alt="logo" className="w-10" />
          <span>EduLearn</span>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6">
            <a href="home.html" className="hover:text-blue-500">Home</a>
            <a href="#" className="hover:text-blue-500">Courses</a>
            <a href="#" className="hover:text-blue-500">Instructors</a>
            <a href="#" className="hover:text-blue-500">Community</a>
          </nav>
          <div className="flex gap-2">
            
               <button className="bg-gray-100 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-200 transition">
      <Bell className="w-5 h-5 text-gray-700" />
    </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD8Py44jLtIhnved91AB50jO-DP8_n3_5AZAnMzQJ8rCI_zKIM7PBLeqmgH0No8StUtjyGMKCKI79KK_PExoMFqENpNLP5wadJexsq6Vkv6iUSi-WKDQFJ7sEx0bePjzuIxDi6WQFnxbmNwb929vMni-3BffxxDGISIXwzQDRwLr4rmvpcVnEGS-zpNpaP7Lz6kaykxjmVP0qG7crhxXnLXvfoxwrwe9tXilqu6movpulVN84QlnEHFmtc35GrJDKdfJtfD8IP4J3cT")',
              }}
            ></div>
          </div>
          <div className="md:hidden text-2xl cursor-pointer">&#9776;</div>
        </div>
      </header>

      {/* Main Quiz Content */}
      <div className="min-h-screen flex flex-col justify-between bg-gray-50 text-gray-900 border-t">
        <div className="max-w-2xl mx-auto p-6">
          {/* Title */}
          <h1 className="text-2xl font-bold mb-6">
            Quiz: Introduction to Data Science
          </h1>

          {/* Progress Bar */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full w-3/5"></div>
            </div>
            <p className="text-sm text-blue-600 mt-1">6/10 Questions Answered</p>
          </div>

          {/* Question */}
          <div className="mb-6">
            <h2 className="font-semibold mb-4">Question 7</h2>
            <p className="mb-4">
              Which of the following is NOT a key step in the data science
              process?
            </p>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center border rounded-lg px-4 py-3 cursor-pointer border-blue-500 bg-blue-50">
                <input type="radio" name="quiz" className="mr-3 accent-blue-500" />
                Data Collection
              </label>

              <label className="flex items-center border rounded-lg px-4 py-3 cursor-pointer border-gray-200">
                <input type="radio" name="quiz" className="mr-3 accent-blue-500" />
                Model Deployment
              </label>

              <label className="flex items-center border rounded-lg px-4 py-3 cursor-pointer border-gray-200">
                <input type="radio" name="quiz" className="mr-3 accent-blue-500" />
                Hypothesis Generation
              </label>

              <label className="flex items-center border rounded-lg px-4 py-3 cursor-pointer border-gray-200">
                <input type="radio" name="quiz" className="mr-3 accent-blue-500" />
                Coffee Break
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
              Previous
            </button>
            <button className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
              Next
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-between items-center px-6 py-4 text-sm text-gray-500 ">
          <a href="#">Terms of Service</a>
          <p className="text-blue">©2024 EduLearn. All rights reserved.</p>
          <a href="#">Privacy Policy</a>
        </footer>
      </div>
    </div>
  );
}
