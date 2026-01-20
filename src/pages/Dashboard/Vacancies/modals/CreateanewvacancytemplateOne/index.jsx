import { Popconfirm, Space } from "antd";
import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { MdOutlineDragIndicator } from "react-icons/md";
import { default as ModalProvider } from "react-modal";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Heading, Img, Input, Text } from "../../components/components";

export default function CreateanewvacancytemplateOne({ isOpen, ...props }) {
  const router = useRouter();;
  const [stages, setStages] = useState([
    { id: "1", text: "Phone screening" },
    { id: "2", text: "1st interview" },
    { id: "3", text: "2nd interview" },
    { id: "4", text: "Offer" },
    { id: "5", text: "Hired" },
  ]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    if (!result.source) return;

    const items = Array.from(stages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setStages(items);
  };

  return (
    <>
      <div className="container-sm rounded-[12px] bg-white-A700 mdx:p-5">
        <div className="flex flex-col gap-[271px] rounded-[12px] p-8 mdx:gap-[203px] smx:gap-[135px] smx:p-5">
          <div className="flex flex-col gap-[31px]">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-6 mdx:flex-col">
                <Heading
                  size="7xl"
                  as="h1"
                  className="self-end !text-[#000000]_01"
                >
                  New vacancy: Senior Product Manager
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
            <div className="flex flex-col items-start gap-6 pt-1">
              <Heading size="4xl" as="h2" className="!text-blue_gray-700">
                Set hiring stages
              </Heading>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="stages">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="w-full"
                    >
                      {stages.map((stage, index) => (
                        <Draggable
                          key={stage.id}
                          draggableId={stage.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="w-full mb-3"
                            >
                              <Input
                                shape="round"
                                value={stage.text}
                                onChange={(e) =>
                                  setStages((s) => {
                                    const cur = [...s];
                                    cur[index].text = e;

                                    return cur;
                                  })
                                }
                                ignoreSuffixClick
                                suffix={
                                  <Space>
                                    <MdOutlineDragIndicator
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                      }}
                                    />

                                    <Popconfirm
                                      title="Are you sure"
                                      onConfirm={() => {
                                        setStages((s) => {
                                          const cur = [
                                            ...s.slice(0, index),
                                            ...s.slice(index + 1),
                                          ];

                                          return cur;
                                        });
                                      }}
                                    >
                                      <Img
                                        src="/images/trash-01.png"
                                        alt="edit-2"
                                        className="h-[18px] w-[18px]"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                        }}
                                      />
                                    </Popconfirm>
                                  </Space>
                                }
                                className="gap-[35px] self-stretch border border-solid border-blue_gray-100 smx:pr-5"
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <Button
                shape="round"
                leftIcon={
                  <Img
                    src="/images/plus.svg"
                    alt="plus"
                    className="h-[20px] w-[20px]"
                  />
                }
                className="w-full gap-1.5 font-semibold smx:px-5 bg-[#EFF8FF] text-indigo-500"
                onClick={() =>
                  setStages((s) => [...s, { id: `${s.length + 1}`, text: "" }])
                }
              >
                Add more
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="h-px bg-blue_gray-50_01" />
            <Button
              shape="round"
              className="w-full border border-solid border-light_blue-A700 font-semibold smx:px-5 bg-indigo-500 text-white"
            >
              Save & Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
