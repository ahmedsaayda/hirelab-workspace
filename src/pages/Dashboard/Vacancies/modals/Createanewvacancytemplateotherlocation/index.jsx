import React, { useState } from "react";
import { default as ModalProvider } from "react-modal";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Heading, Img, Input, Text } from "../../components/components";

export default function Createanewvacancytemplateotherlocation({
  isOpen,
  onClose,
  ...props
}) {
  const router = useRouter();;
  return (
    <>
      <div className="container-sm rounded-[12px] bg-white-A700 mdx:p-5">
        <div className="rounded-[12px] p-8 smx:p-5">
          <div className="flex flex-col gap-[31px]">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-6 mdx:flex-col">
                <Heading
                  size="7xl"
                  as="h1"
                  className="self-end !text-[#000000]_01"
                >
                  New vacancy: Senior Product Managerr
                </Heading>
                <div className="flex flex-1 items-center gap-4 mdx:flex-col mdx:self-stretch">
                  <Img
                    src="/images/img_divider.svg"
                    alt="divider"
                    className="h-[12px] w-[20%] mdx:w-full"
                  />
                  <Link href="/dashboard/vacancies/new">
                    <Text
                      size="3xl"
                      as="p"
                      className={`flex h-[30px] w-[30px] px-[10px] items-center justify-center rounded-[100%] border-[0.5px]  cursor-pointer border-solid border-light_blue-A700 text-center !font-medium !text-white bg-indigo-500 `}
                    >
                      1
                    </Text>
                    <div className="flex">
                      <Text
                        size="3xl"
                        as="p"
                        className="!font-medium !text-blue_gray-800_01 whitespace-nowrap cursor-pointer "
                      >
                        Basic info
                      </Text>
                    </div>
                  </Link>
                  <Img
                    src="/images/img_divider.svg"
                    alt="divider"
                    className="h-[12px] w-[20%] mdx:w-full"
                  />
                  <Link href="/dashboard/vacancies/new/2">
                    <Text
                      size="3xl"
                      as="p"
                      className={`flex h-[30px] w-[30px] px-[10px] items-center justify-center rounded-[100%] border-[0.5px]  cursor-pointer border-solid border-light_blue-A700 text-center !font-medium  text-indigo-500 `}
                    >
                      2
                    </Text>
                    <div className="flex cursor-pointer ">
                      <Text
                        size="3xl"
                        as="p"
                        className="!font-medium !text-blue_gray-800_01"
                      >
                        Stages
                      </Text>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="h-px bg-blue_gray-50" />
            </div>
            <div className="flex flex-col items-start gap-[27px]">
              <Heading size="4xl" as="h2" className="!text-blue_gray-700">
                Add a location
              </Heading>
              <div className="flex flex-col gap-6 self-stretch">
                <div className="flex gap-3 mdx:flex-col">
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex self-start">
                      <Text as="p" className="!text-blue_gray-700">
                        Country
                      </Text>
                    </div>
                    <Input
                      shape="round"
                      name="country"
                      placeholder={`France`}
                      className="border border-solid border-blue_gray-100 smx:pr-5"
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex self-start">
                      <Text as="p" className="!text-blue_gray-700">
                        City
                      </Text>
                    </div>
                    <Input
                      shape="round"
                      name="city"
                      placeholder={`Lyon`}
                      className="border border-solid border-blue_gray-100 smx:pr-5"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mdx:flex-col">
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex self-start">
                      <Text as="p" className="!text-blue_gray-700">
                        Office Name
                      </Text>
                    </div>
                    <Input
                      shape="round"
                      type="text"
                      name="name"
                      placeholder={`namename`}
                      className="border border-solid border-blue_gray-100 smx:pr-5"
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex self-start">
                      <Text as="p" className="!text-blue_gray-700">
                        Your Location
                      </Text>
                    </div>
                    <Input
                      shape="round"
                      name="location"
                      placeholder={`Lyon`}
                      className="border border-solid border-blue_gray-100 smx:pr-5"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mdx:flex-col">
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex self-start">
                      <Text as="p" className="!text-blue_gray-700">
                        Street
                      </Text>
                    </div>
                    <Input
                      shape="round"
                      type="text"
                      name="name"
                      placeholder={`namename`}
                      className="border border-solid border-blue_gray-100 smx:pr-5"
                    />
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex self-start">
                      <Text as="p" className="!text-blue_gray-700">
                        Address
                      </Text>
                    </div>
                    <Input
                      shape="round"
                      name="address"
                      placeholder={`Lyon`}
                      className="border border-solid border-blue_gray-100 smx:pr-5"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex self-start">
                    <Text as="p" className="!text-blue_gray-700">
                      Save Address as
                    </Text>
                  </div>
                  <div className="flex justify-between gap-16 mdx:flex-col">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col self-start pt-0.5">
                        <div className="flex flex-col items-center rounded-lg border border-solid border-light_blue-A700 bg-light_blue-A700 p-[3px]">
                          <Img
                            src="/images/img_check_white_a700.svg"
                            alt="check"
                            className="h-[10px] w-[10px] cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="flex py-px">
                        <Text as="p" className="!text-blue_gray-800">
                          Home
                        </Text>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col self-start pt-0.5">
                        <div className="h-[16px] w-[16px] rounded-lg border border-solid border-blue_gray-100 bg-white-A700 cursor-pointer" />
                      </div>
                      <div className="flex py-px">
                        <Text as="p" className="!text-blue_gray-800">
                          Office
                        </Text>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col self-start pt-0.5">
                        <div className="h-[16px] w-[16px] rounded-lg border border-solid border-blue_gray-100 bg-white-A700 cursor-pointer" />
                      </div>
                      <div className="flex py-px">
                        <Text as="p" className="!text-blue_gray-800">
                          Other
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Img
              src="/images/img_rectangle.png"
              alt="image"
              className="h-[279px] object-cover"
            />
          </div>
          <div className="flex flex-col gap-5">
            <div className="h-px bg-blue_gray-50_01" />
            <div className="flex gap-5">
              <Button
                shape="round"
                className="w-full border border-solid border-blue_gray-100 font-semibold smx:px-5"
                onClick={onClose}
              >
                Back
              </Button>
              <Button
                shape="round"
                className="w-full border border-solid border-light_blue-A700 font-semibold smx:px-5 bg-indigo-500 text-white"
                onClick={onClose}
              >
                Add a location
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
