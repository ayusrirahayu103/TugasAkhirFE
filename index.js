const { createApp, ref, onMounted } = Vue;

const app = createApp({
    setup() {
        const url = "http://localhost:12000/bayi";

        const bayi = ref({
            id: null,
            namabayi: "",
            umur: "",
            namaibu: "",
            tahunlahir: "",
            listbayi: [],
            errorMessage: "",
            isError: false,
            isUpdate: false,
});

    const getBayi = async() => {
    try {
        bayi.value.isUpdate = false;
        const resBayi = await axios.get(url);
        if (resBayi.data.length === 0)
          throw new Error("Data Bayi Tidak Terdata Di Posyandu");
        bayi.value.listbayi = resBayi.data;
        return resBayi.data;
        } catch (err) {
        bayi.value.isError = true;
        bayi.value.errorMessage = err.message;
        bayi.value.isUpdate = false;
        }
    };

    const getBayiById= async(id) => {
        try {
            const resBayi = await axios.get(url + `/${id}`);
            if (resBayi.data.length === 0)
              throw new Error("Data Bayi Tidak Ditemukan");
            bayi.value.isUpdate = true;
            bayi.value.id = id;
            bayi.value.namabayi = resBayi.data.namabayi;
            bayi.value.umur = resBayi.data.umur;
            bayi.value.namaibu= resBayi.data.namaibu;
            bayi.value.tahunlahir = resBayi.data.tahunlahir;
            return resBayi.data;
    } catch (err) {
            bayi.value.namabayi = "";
            bayi.value.umur = "";
            bayi.value.namaibu = "";
            bayi.value.tahunlahir = "";
            bayi.value.isError = true;
            bayi.value.errorMessage = err.message;
            bayi.value.isUpdate = false;
     }
    };
    
    const deleteBayi= async (id) => {
        try {
            bayi.value.isUpdate = false;
            const resBayi = await axios.delete(url + "/delete", {
                data: {
                  id,
                },
            });
            if (resBayi.data.length === 0)
                throw new Error("Data Bayi Tidak Ditemukkan");
            bayi.value.list = resBayi.data;
            await getBayi();
            return resBayi.data;
        } catch (err) {
              bayi.value.isError = true;
              bayi.value.errorMessage = err.message;
     }
    }; 

    const submitBayi = async () => {
        try {
            bayi.value.isUpdate = false;
            const post = await axios.post(url + "/create", {
                namabayi: bayi.value.namabayi,
                umur: bayi.value.umur,
                namaibu: bayi.value.namaibu,
                tahunlahir: bayi.value.tahunlahir,
            });
            bayi.value.isError = false;
            bayi.value.namabayi = "";
            bayi.value.umur = "";
            bayi.value.namaibu = "";
            bayi.value.tahunlahir = "";
            bayi.value.isUpdate = false;
            if (!post) throw new Error("Gagal Memuat Data Baru");
            await getBayi();
        } catch (err) {
            bayi.value.isError = true;
            bayi.value.errorMessage = err.message;
         }
        };

    const updateBayi = async () => {
        try {
            bayi.value.isUpdate = true;
            const put = await axios.put(url + "/update", {
                id: bayi.value.id,
                namabayi: bayi.value.namabayi,
                umur: bayi.value.umur,
                namaibu: bayi.value.namaibu,
                tahunlahir: bayi.value.tahunlahir, 
            });
            bayi.value.isError = false;
            bayi.value.namabayi = "";
            bayi.value.umur = "";
            bayi.value.namaibu = "";
            bayi.value.tahunlahir = "";
            bayi.value.isUpdate = false;
            bayi.value.isError = true;
            if (!put) throw new Error("Gagal Mengupdate Data Bayi");
             await getBayi();
        } catch (err) {
            bayi.value.isUpdate = false;
            bayi.value.isError = true;
            bayi.value.errorMessage = err.message;
        }
    };
    
    onMounted(async () => {
        await getBayi();
    });
  
      return {
        bayi,
        submitBayi,
        updateBayi,
        deleteBayi,
        getBayiById,
    };
  },
});
  
app.mount("#app");