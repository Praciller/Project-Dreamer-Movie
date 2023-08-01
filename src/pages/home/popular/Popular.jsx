import React, { useState } from "react";

import Carousel from "../../../components/carousel/Carousel";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../../components/switchTabs/SwitchTabs";

import useFetch from "../../../hooks/useFetch";

const Popular = () => {
    const [endpoint, setEndpoint] = useState("movie");  //เพื่อจัดการสถานะของ endpoint ซึ่งเป็นตัวกำหนดให้เราดึงข้อมูลเพื่อแสดงภาพยนตร์หรือรายการทีวียอดนิยมจาก API ของ TMDB.

    const { data, loading } = useFetch(`/${endpoint}/popular`); //เป็นตัวจัดการการดึงข้อมูลจาก API ของ TMDB สำหรับภาพยนตร์หรือรายการทีวียอดนิยมตาม endpoint ที่เลือก.

    //เรียกใช้เมื่อผู้ใช้เปลี่ยนแท็บในคอมโพเนนต์ SwitchTabs โดยจะทำการอัปเดตสถานะ endpoint ตามแท็บที่เลือก ที่อาจเป็น "Movies" หรือ "TV Shows" ซึ่งจะกำหนดประเภทของข้อมูลที่จะดึงจาก API ของ TMDB.
    const onTabChange = (tab) => {
        setEndpoint(tab === "Movies" ? "movie" : "tv");
    };

    return (
        <div className="carouselSection">
            <ContentWrapper>
                <span className="carouselTitle">What's Popular</span>
                <SwitchTabs
                    data={["Movies", "TV Shows"]}
                    onTabChange={onTabChange}
                />
            </ContentWrapper>
            <Carousel
                data={data?.results}
                loading={loading}
                endpoint={endpoint}
            />
        </div>
    );
};

export default Popular;