import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useEffect, useReducer, useRef, useState } from "react";
import { db } from "../firebaseConfig";

function blogsReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [action.blog, ...state];
    case "REMOVE":
      return state.filter((blog, i) => action.index !== i);
    case "UPDATE":
      return action.blogs;
    default:
      return state;
  }
}

//Blogging App using Hooks
export default function Blog() {
  //   const [title, setTitle] = useState("");
  //   const [content, setContent] = useState("");
  const [formData, setFormData] = useState({ title: "", content: "" });
  //   const [blogs, setBlogs] = useState([]);
  const [blogs, dispatch] = useReducer(blogsReducer, []);
  const titleRef = useRef();

  useEffect(() => {
    titleRef.current.focus();
  }, []);

  useEffect(() => {
    document.title =
      blogs.length && blogs[0].title ? blogs[0].title : "No Blogs";
  }, [blogs]);

  useEffect(() => {
    // const fetchData = async () => {
    //   const querySnapshot = await getDocs(collection(db, "blogs"));
    //   querySnapshot.docs.map((doc) => {
    //     dispatch({ type: "ADD", blog: { id: doc.id, ...doc.data() } });
    //   });
    // };
    // fetchData();

    const unsub = onSnapshot(collection(db, "blogs"), (querySnapshot) => {
      let blogs = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      console.log(blogs)
      dispatch({ type: "UPDATE", blogs });
    });
  }, []);

  //Passing the synthetic event as argument to stop refreshing the page on submit
  async function handleSubmit(e) {
    e.preventDefault();
    // setBlogs([formData, ...blogs]);
    // dispatch({ type: "ADD", blog: formData });
    document.title = formData.title;

    const docRef = doc(collection(db, "blogs"));
    await setDoc(docRef, {
      title: formData.title,
      content: formData.content,
    });

    // await addDoc(collection(db, "blogs"), {
    //   title: formData.title,
    //   content: formData.content,
    // });
    console.log(blogs);

    setFormData({ title: "", content: "" });
    titleRef.current.focus();
  }

  const handleDeleteBlog = async (index) => {
    // setBlogs(blogs.filter((blog, i) => i !== index));
    await deleteDoc(doc(db, "blogs", index));
    dispatch({ type: "REMOVE", index });
  };

  return (
    <>
      {/* Heading of the page */}
      <h1>Write a Blog!</h1>

      {/* Division created to provide styling of section to the form */}
      <div className="section">
        {/* Form for to write the blog */}
        <form onSubmit={handleSubmit}>
          {/* Row component to create a row for first input field */}
          <Row label="Title">
            <input
              className="input"
              placeholder="Enter the Title of the Blog here.."
              value={formData.title}
              ref={titleRef}
              onChange={(e) =>
                setFormData({
                  title: e.target.value,
                  content: formData.content,
                })
              }
            />
          </Row>

          {/* Row component to create a row for Text area field */}
          <Row label="Content">
            <textarea
              className="input content"
              placeholder="Content of the Blog goes here.."
              value={formData.content}
              required
              onChange={(e) =>
                setFormData({ title: formData.title, content: e.target.value })
              }
            />
          </Row>

          {/* Button to submit the blog */}
          <button className="btn">ADD</button>
        </form>
      </div>

      <hr />

      {/* Section where submitted blogs will be displayed */}
      <h2> Blogs </h2>
      {blogs.map((blog, index) => (
        <div className="blog" key={index}>
          <h3>{blog.title}</h3>
          <p>{blog.content}</p>
          <div className="blog-btn">
            <button
              onClick={() => handleDeleteBlog(blog.id)}
              className="btn remove"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

//Row component to introduce a new row section in the form
function Row(props) {
  const { label } = props;
  return (
    <>
      <label>
        {label}
        <br />
      </label>
      {props.children}
      <hr />
    </>
  );
}
