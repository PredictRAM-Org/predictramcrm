import { Grid } from '@mui/material';
import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageService from 'src/services/Image.service';
// import { ImageUpload } from 'services/image/ImageUpload';
// import { ErrorToast } from 'utils';
// import '../../assets/css/richTextEditor.css'; // just for custom css

export default function FormikRichText({ id, label, name, value, /* setValue */ setCallDetails }) {
  const quillRef = useRef();

  const imageHandler = (e) => {
    const editor = quillRef.current.getEditor();
    console.log(editor);
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (/^image\//.test(file.type)) {
        const uploadedImageUrl = await ImageService.upload(file);
        editor.insertEmbed(editor.getSelection(), 'image', uploadedImageUrl);
      } else {
        console.error('You could only upload images.');
      }
    };
  };
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          ['image', 'link'],
          [
            {
              color: [
                '#000000',
                '#e60000',
                '#ff9900',
                '#ffff00',
                '#008a00',
                '#0066cc',
                '#9933ff',
                '#ffffff',
                '#facccc',
                '#ffebcc',
                '#ffffcc',
                '#cce8cc',
                '#cce0f5',
                '#ebd6ff',
                '#bbbbbb',
                '#f06666',
                '#ffc266',
                '#ffff66',
                '#66b966',
                '#66a3e0',
                '#c285ff',
                '#888888',
                '#a10000',
                '#b26b00',
                '#b2b200',
                '#006100',
                '#0047b2',
                '#6b24b2',
                '#444444',
                '#5c0000',
                '#663d00',
                '#666600',
                '#003700',
                '#002966',
                '#3d1466',
              ],
            },
          ],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );
  return (
    <Grid item xs={12}>
      <ReactQuill
        id={id}
        name="description"
        theme="snow"
        ref={quillRef}
        value={value}
        modules={modules}
        onChange={(e) => setCallDetails((prev) => ({ ...prev, description: e }))}
      />
    </Grid>
  );
}
