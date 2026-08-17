<template>
    <div class="page-container">
        <van-nav-bar title="智能旅游助手" />
        <div class="page-content">
            <van-notice-bar 
                left-icon="info-o"
                text="基于AI的智能景点介绍和行程规划系统"
                style="margin-bottom: 16px;"
            />
            <div class="card search-card">
                <div class="section-title">
                    规划你的旅程
                </div>
                <van-field 
                    @click="showCityPicker=true"
                    is-link 
                    v-model="formData.city" 
                    label="目的地" 
                    placeholder="请选择城市"
                    readonly
                    style="background: #f7f8fa; border-radius: 8px; margin-bottom: 12px;"
                />
                <van-field 
                    v-model="formData.budget" 
                    label="预算（元）" 
                    placeholder="请输入预算金额"
                    :border="false"
                    type="number"
                    style="background: #f7f8fa; border-radius: 8px; margin-bottom: 12px;"
                />
                <van-field 
                    v-model="formData.days" 
                    label="天数" 
                    placeholder="请输入天数"
                    :border="false"
                    type="digit"
                    style="background: #f7f8fa; border-radius: 8px; margin-bottom: 12px;"
                />
                <van-button 
                    type="primary" 
                    size="large"
                    round
                    :loading="isLoading"
                    @click="handleSubmit"
                >
                    开始规划
                </van-button>
            </div>
            <div class="card quick-actions">
                <div class="section-title">
                    快捷入口
                </div>
                <van-grid :column-num="2" :gutter="12">
                    <van-grid-item @click="goPage('/chat')" icon="chat-o" text="AI 对话" />
                    <van-grid-item @click="goPage('/profile')" icon="user-o" text="我的" />
                </van-grid>
            </div>
            <div class="card popular-destinations">
                <div class="section-title">
                    热门目的地
                </div>
                <van-grid :column-num="4" :gutter="8">
                    <van-grid-item @click="selectedCity(city)" v-for="(city,index) in popularCities" :key="index" :text="city">
                        <div class="city-tag" :class="{'active': formData.city === city}">
                            {{city}}
                        </div>
                    </van-grid-item>
                </van-grid>
            </div>
        </div>
        <van-popup
            round
            v-model:show="showCityPicker"
            position="bottom"
        >
            <van-picker
                title="选择目的地"
                :columns="cityColumns"
                @confirm="handleCityConfirm"
                @cancel="showCityPicker=false"
            />
        </van-popup>
    </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

const formData = reactive({
    city: '',
    budget: null,
    days: null
})

const showCityPicker = ref(false)

const allCities = [
    '北京','上海','广州','深圳','成都','杭州','西安','重庆',
    '南京','武汉','苏州','长沙','天津','郑州','济南','青岛','合肥',
]

const popularCities = ['北京','上海','广州','深圳','成都','杭州','西安','重庆']

const cityColumns = allCities.map(city => ({ text: city, value: city }))

const handleCityConfirm = ({selectedOptions}) => {
    formData.city = selectedOptions[0].value
    showCityPicker.value = false
}

const isLoading = ref(false)

const handleSubmit = () => {
    isLoading.value = true
    // 判断目的地
    if (!formData.city) {
        showToast('请选择目的地')
        return
    }
    // 判断预算
    if(!formData.budget || formData.budget <= 100){
        showToast('预算不能低于100元')
        return
    }
    // 判断天数
    if(!formData.days || formData.days < 1 || formData.days > 30){
        showToast('天数必须在1-30天之间')
        return
    }
    router.push({
        path: '/detail',
        query: {
            city: formData.city,
            budget: formData.budget,
            days: formData.days
        }
    })
}

const goPage = (path) => {
    router.push(path)
}

const selectedCity = (city) => {
    formData.city = city
}
</script>
<style scoped>
.search-card {
    margin-bottom: 16px;
}
.city-tag {
    padding: 8px 12px;
    border-radius: 16px;
    font-size: 14px;
    color: #666;
    background: #f7f8fa;
    transition: all 0.3s;
}
.city-tag.active {
    background: #1989fa;
    color: #fff;
}
</style>