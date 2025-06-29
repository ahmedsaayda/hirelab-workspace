import { Divider, Popconfirm, Skeleton, Space, Button } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectLoading, selectUser } from "../../../redux/auth/selectors";
import CrudService from "../../../service/CrudService";
// import { Button } from "../../Landing/Button";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import NoteDetail from "./NoteDetails";
import { PlusCircleFilled } from "@ant-design/icons";

ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      "heading",
      "|",
      "bold",
      "italic",
      "|",
      "bulletedList",
      "numberedList",
      "|",
      "insertTable",
      "|",
      "undo",
      "redo",
    ],
  },
  image: {
    toolbar: [
      "imageStyle:full",
      "imageStyle:side",
      "|",
      "imageTextAlternative",
    ],
  },
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },
  language: "en",
};

const getNoteUser = (user, note) => {
  if (!note?.loggedBy?.firstName) return user;
  return note.loggedBy;
};

const CandidateNote = ({
  candidateId,
  showHeadings,
  handleNext,
  handlePrev,
}) => {
  const [note, setNote] = useState(
    localStorage[`candidateNote_${candidateId}`] ?? ""
  );
  const [candidateData, setCandidateData] = useState(null);
  const [candidateNotes, setCandidateNotes] = useState([]);
  const [newNote, setNewNote] = useState({ message: "", attachments: null });
  const [editing, setEditing] = useState(null);
  console.log("candidateNotes", candidateNotes);

  const getCandidateNote = () => {
    CrudService.search("CandidateNote", 1000, 1, {
      filters: { vacancySubmission: candidateId },
      // populate: "loggedBy",
      populate: {
        path: "loggedBy",
        select: "firstName lastName email avatar _id",
      },
    }).then(({ data }) => {
      console.log(data.items);
      setCandidateNotes(data.items);
    });
  };
  useEffect(() => {
    if (!candidateId) return;
    CrudService.getSingle("VacancySubmission", candidateId).then(({ data }) => {
      if (data.candidateNote) setNote(data.candidateNote);
      if (data) setCandidateData(data);
      if (data) {
        setCandidateNotes(data.notes);
      }
    });

    getCandidateNote();
  }, [candidateId]);

  const debounceDelay = 750;
  const debounceTimer = useRef(null);

  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  useEffect(() => {
    if (!user) return;
    if (user?.accessLevel === "read") return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(
      () => {
        localStorage[`candidateNote_${candidateId}`] = note;
        CrudService.update("VacancySubmission", candidateId, {
          candidateNote: note,
        });
      },
      debounceDelay,
      user
    );

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [note, candidateId]);

  if (!candidateData) return <Skeleton active />;
  return (
    <>
      {showHeadings && (
        <div>
          <h2 className="custom-label-title">Candidate Notes</h2>
          <h3 className="custom-label-title">
            {candidateData?.formData?.firstname}{" "}
            {candidateData?.formData?.lastname}
          </h3>
        </div>
      )}

      {editing === true && (
        <NoteDetail
          isNew
          onCancel={() => setEditing(null)}
          candidateId={candidateId}
          reload={getCandidateNote}
        />
      )}
      {!editing && (
        <Button
          onClick={() => {
            setNewNote({ message: "", attachments: null });
            setEditing(true);
          }}
          type="primary"
          className="w-full mt-2 "
        >
          <PlusCircleFilled />
          Add Note
        </Button>
      )}


      <Divider />
      <h3 className="custom-label">Notes</h3>

      <div className="flex flex-col gap-2">
        {candidateNotes
          ?.sort?.((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          ?.map?.((note) => {
            console.log(note);
            return (
              <NoteDetail
                defaultValue={note}
                onCancel={() => setEditing(null)}
                candidateId={candidateId}
                reload={getCandidateNote}
              />
            );

            return (
              <div
                className="relative pt-0 pb-2 my-5 border-b-2 border-gray-100"
                key={note?._id}
              >
                <div className="flex flex-col ">
                  <div>
                    <Space>
                      <PencilSquareIcon
                        width={18}
                        className="cursor-pointer"
                        onClick={() =>
                          setEditing((e) =>
                            e?._id === note._id ? null : { ...note }
                          )
                        }
                      />
                      <Popconfirm
                        title="Are you sure to delete?"
                        onConfirm={async () => {
                          if (!note?._id) return;
                          await CrudService.delete(
                            "CandidateNotes",
                            note?._id
                          ).then(() => {
                            setCandidateNotes((e) =>
                              e.filter((x) => x._id !== note?._id)
                            );
                          });
                        }}
                      >
                        <TrashIcon
                          width={18}
                          className="text-red-500 cursor-pointer"
                        />
                      </Popconfirm>
                    </Space>
                  </div>
                  <div className="text-sm text-gray-400 ">
                    {getNoteUser(user, note)?.firstName ?? ""}{" "}
                    {getNoteUser(user, note)?.lastName ?? ""}{" "}
                    {`<${getNoteUser(user, note)?.email ?? ""}>`} at{" "}
                    {moment(note.createdAt).format("HH:mm, Do MMM YYYY")}
                  </div>
                </div>
                {editing?._id === note._id ? (
                  <div className="dark:text-black">
             

                    <Button
                      type="primary"
                      className="w-full mt-2 rounded-none rounded-b-lg"
                      onClick={() => {
                        if (loading) return;
                        CrudService.update("CandidateNotes", editing._id, {
                          message: editing.message,
                        }).then(({ data }) => {
                          CrudService.search("CandidateNotes", 1000, 1, {
                            filters: { candidate: candidateId },
                            populate: "loggedBy",
                          }).then(({ data }) => {
                            setCandidateNotes(data.items);
                            setEditing(null);
                          });
                        });
                      }}
                      disabled={loading}
                      loading={loading}
                    >
                      <span>Update</span>
                    </Button>
                  </div>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: note?.message?.replace?.(/\n/g, "<br>"),
                    }}
                  />
                )}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default CandidateNote;
