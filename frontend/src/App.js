import { useEffect, useState } from 'react';
import './App.css';
import { useUser } from './context';
import { useRef } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

function App() {

  const { user, setUser } = useUser()
  const [newOpen, setNewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const cancelButtonRef = useRef(null)
  const [formsList, setFormsList] = useState([])
  const [editFormId, setEditFormId] = useState("")

  const handleDelete = (form) => {
    fetch(
      "/api/delete?" +
      "name=" + encodeURIComponent(form.name) +
      "&applicant=" + encodeURIComponent(form.applicant) +
      "&status=" + encodeURIComponent(form.status) +
      "&action=" + encodeURIComponent(form.action) +
      "&action_href=" + encodeURIComponent(form.action_href)
    )
      .then(res => res.json())
      .then(data => {
        if (data.message == "Form silindi") {
          fetch("/api/get")
            .then((res) => res.json())
            .then((forms) => {
              setFormsList(forms)
            })
            .catch(() => alert("Hata"))
        }
      })
  }

  const handleEdit = (formId) => {
    setEditFormId(formId)
    setEditOpen(true)
  }

  const editForm = async (editedFormId) => {
    const edit_form_name = document.getElementById("edit_form_name").value
    const edit_form_applicant = document.getElementById("edit_form_applicant").value
    const edit_form_status = document.getElementById("edit_form_status").value
    const edit_form_action = document.getElementById("edit_form_action").value
    const edit_form_action_href = document.getElementById("edit_form_action_href").value || "#"

    await fetch(`/api/edit?id=${editedFormId}&name=${encodeURIComponent(edit_form_name)}&applicant=${encodeURIComponent(edit_form_applicant)}&status=${encodeURIComponent(edit_form_status)}&action=${encodeURIComponent(edit_form_action)}&action_href=${encodeURIComponent(edit_form_action_href)}`).then((e) => e.json()).then(data => {
      if (data.message && data.message == "Form güncellendi") {
        setEditOpen(false)
        setEditFormId("")
        refresh()
      }
      else{
        alert("Form güncellenirken hata oluştu")
      }
    })
  }


  const refresh = () => {
    fetch("/api/get")
      .then((res) => res.json())
      .then((forms) => {
        setFormsList(forms)
      })
      .catch(() => alert("Hata"))
  }

  const createForm = () => {
    const form_name = document.getElementById("form_name").value
    const form_applicant = document.getElementById("form_applicant").value
    const form_status = document.getElementById("form_status").value
    const form_action = document.getElementById("form_action").value
    const form_action_href = document.getElementById("form_action_href").value || "#"

    fetch(`/api/create?name=${encodeURIComponent(form_name)}&applicant=${encodeURIComponent(form_applicant)}&status=${encodeURIComponent(form_status)}&action=${encodeURIComponent(form_action)}&action_href=${encodeURIComponent(form_action_href)}`)
      .then((data) => data.json())
      .then((e) => {
        if (e && e.message === "Form oluşturuldu") {
          setNewOpen(false)
          refresh()
        } else {
          alert("Form oluşturulurken hata oluştu.")
        }
      })
      .catch((err) => {
        alert("Sunucu hatası: " + err.message)
      })
  }

  useEffect(() => {
    if (user) {
      fetch("/api/get")
        .then((res) => res.json())
        .then((forms) => {
          setFormsList(forms)
        })
        .catch(() => alert("Hata"))
    }
  }, [user])

  return (
    <>
      {!user ?
        <div className='w-full h-full flex justify-center mt-32 pr-4'>
          <button className='border-2 border-blue-600 px-2 py-2 bg-blue-600 text-white rounded-lg text-xl' onClick={() => window.location.href = "/auth/login"}>
            Giriş Yap
          </button>
        </div> : <div className='w-full flex justify-end mt-4 pr-4'>
          <h1>Oturum türü: {user}</h1>
        </div>
      }
      {user == "user" && <center className='mt-16'>
        <div class="relative overflow-x-auto">
          <table class="w-full text-sm text-left rtl:text-right text-black bg-white">
            <thead class="text-xs text-black uppercase bg-white">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Başvuru Adı
                </th>
                <th scope="col" class="px-6 py-3">
                  Başvuru Sahibi
                </th>
                <th scope="col" class="px-6 py-3">
                  Durum
                </th>
                <th scope="col" class="px-6 py-3" id='action-button'>
                  Eylem
                </th>
              </tr>
            </thead>
            <tbody id='table-content'>
              {formsList.map((form, index) => (
                <tr class="bg-white border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-black whitespace-nowrap">
                    {form.name}
                  </th>
                  <td class="px-6 py-4">{form.applicant}</td>
                  <td class="px-6 py-4">{form.status}</td>
                  <a href={form.action_href}>
                    <td class="px-6 py-4 cursor-pointer text-blue-600">{form.action}</td>
                  </a>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='w-full h-full flex justify-center mt-32 pr-4'>
            <button className='border-2 border-blue-600 px-2 py-2 bg-blue-600 text-white rounded-lg text-xl' onClick={() => refresh()}>
              Yenile
            </button>
          </div>
        </div>
      </center>
      }

      {user == "admin" && <center className='mt-16'>
        <div class="relative overflow-x-auto">
          <table class="w-full text-sm text-left rtl:text-right text-black bg-white">
            <thead class="text-xs text-black uppercase bg-white">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Başvuru Adı
                </th>
                <th scope="col" class="px-6 py-3">
                  Erişim Grubu
                </th>
                <th scope="col" class="px-6 py-3">
                  Durum
                </th>
                <th scope="col" class="px-6 py-3" id='action-button'>
                  Eylem
                </th>
              </tr>
            </thead>
            <tbody id='table-content'>
              {formsList.map((form, index) => (
                <tr class="bg-white border-b border-gray-200">
                  <th scope="row" class="px-6 py-4 font-medium text-black whitespace-nowrap">
                    {form.name}
                  </th>
                  <td class="px-6 py-4">{form.applicant}</td>
                  <td class="px-6 py-4">{form.status}</td>
                  <a href={form.action_href}>
                    <td class="px-6 py-4 cursor-pointer text-blue-600">{form.action}</td>
                  </a>
                  <button className='px-4 text-green-500' onClick={() => handleEdit(form._id)}>Formu Düzenle</button>
                  <button className='text-red-400' onClick={() => handleDelete(form)}>Formu Sil</button>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='w-full h-full flex justify-center mt-32 pr-4'>
            <button className='border-2 border-blue-600 px-4 py-2 bg-blue-600 text-white rounded-lg text-xl' onClick={() => refresh()}>
              Yenile
            </button>
            <divider />
            <button className='border-2 border-blue-600 mx-4 px-2 py-2 bg-blue-600 text-white rounded-lg text-xl' onClick={() => setNewOpen(true)}>
              Form Ekle
            </button>
          </div>
        </div>
      </center>
      }

      {newOpen && <div>
        <Dialog open={newOpen} onClose={setNewOpen} className="relative z-10 transition-all" initialFocus={cancelButtonRef}>
          <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex w-12 h-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:w-10 sm:h-10">
                      <ExclamationTriangleIcon aria-hidden="true" className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                        Yeni Form
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Form ismi
                        </p>
                        <input
                          id="form_name"
                          required
                          className="shadow block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                        <p className="text-sm text-gray-500">
                          Erişim Grubu
                        </p>
                        <input
                          id="form_applicant"
                          required
                          className="shadow block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />

                        <p className="text-sm text-gray-500">
                          Durum
                        </p>
                        <input
                          id="form_status"
                          required
                          className="shadow block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />

                        <p className="text-sm text-gray-500">
                          Eylem Adı
                        </p>
                        <input
                          id="form_action"
                          required
                          className="shadow block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />

                        <p className="text-sm text-gray-500">
                          Eylem Yönlendirme Adresi
                        </p>
                        <input
                          id="form_action_href"
                          className="shadow block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={() => {
                      setNewOpen(false)
                      createForm()
                    }}
                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
                  >
                    Onayla
                  </button>
                  <button
                    type="button"
                    ref={cancelButtonRef}
                    onClick={() => setNewOpen(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Vazgeç
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </div>}

      {editOpen && <Dialog open={editOpen} onClose={setEditOpen} className="relative z-10 transition-all" initialFocus={cancelButtonRef}>
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex w-12 h-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:w-10 sm:h-10">
                    <ExclamationTriangleIcon aria-hidden="true" className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                      Form Düzenle: {editFormId}
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Form ismi
                      </p>
                      <input
                        id="edit_form_name"
                        required
                        className="shadow block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                      <p className="text-sm text-gray-500">
                        Erişim Grubu
                      </p>
                      <input
                        id="edit_form_applicant"
                        required
                        className="shadow block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />

                      <p className="text-sm text-gray-500">
                        Durum
                      </p>
                      <input
                        id="edit_form_status"
                        required
                        className="shadow block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />

                      <p className="text-sm text-gray-500">
                        Eylem Adı
                      </p>
                      <input
                        id="edit_form_action"
                        required
                        className="shadow block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />

                      <p className="text-sm text-gray-500">
                        Eylem Yönlendirme Adresi
                      </p>
                      <input
                        id="edit_form_action_href"
                        className="shadow block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    setEditOpen(false)
                    editForm(editFormId)
                  }}
                  className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
                >
                  Onayla
                </button>
                <button
                  type="button"
                  ref={cancelButtonRef}
                  onClick={() => setEditOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Vazgeç
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>}
    </>
  );
}

export default App;

//node index.js 
//npm start