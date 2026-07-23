import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import CategoryPage from './components/pages/CategoryPage';
import DetailPage from './components/pages/DetailPage';

const categoryConfigs = [
  {
    path: '/chocolate',
    title: 'Шоколадные десерты',
    description: 'Шоколад и шоколадные вкусы. Для настоящих ценителей шоколада!',
    bannerImg: 'anich_cakes/img/chocolate/chocolate__banner.jpg',
    breadcrumbLabel: 'Шоколадные',
    categoryPage: '/chocolate',
  },
  {
    path: '/traditional',
    title: 'Традиционные десерты',
    description: 'Знакомые с детства и классические вкусы. Наслаждайтесь любимыми десертами!',
    bannerImg: 'anich_cakes/img/traditional/traditional__banner.jpg',
    breadcrumbLabel: 'Традиционные',
    categoryPage: '/traditional',
  },
  {
    path: '/vegan',
    title: 'Веганские десерты',
    description: 'Идеальные десерты без использования продуктов животного происхождения. 100% растительный состав, невероятный вкус!',
    bannerImg: 'anich_cakes/img/vegan/vegan__banner.jpg',
    breadcrumbLabel: 'Веганские',
    categoryPage: '/vegan',
  },
  {
    path: '/raw',
    title: 'Живые (Raw) десерты',
    description: 'Raw десерты без термической обработки. Максимум пользы и натурального вкуса!',
    bannerImg: 'anich_cakes/img/raw/raw__banner-img.jpg',
    breadcrumbLabel: 'Живые (Raw)',
    categoryPage: '/raw',
  },
  {
    path: '/low-calories',
    title: 'Низкокалорийные десерты',
    description: 'Полезные ПП десерты без белой муки, белого сахара. Наслаждайтесь вкусом без вреда для фигуры!',
    bannerImg: 'anich_cakes/img/low_calories/low-calories__banner-img.png',
    breadcrumbLabel: 'Низкокалорийные',
    categoryPage: '/low-calories',
  },
  {
    path: '/thematical',
    title: 'Тематические десерты',
    description: 'Десерты с украшением к праздникам. Сделайте ваш праздник незабываемым!',
    bannerImg: 'anich_cakes/img/thematical/thematical__banner-img.jpg',
    breadcrumbLabel: 'Тематические',
    categoryPage: '/thematical',
    thematical: true,
  },
];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {categoryConfigs.map((cfg) => (
          <Route
            key={cfg.path}
            path={cfg.path}
            element={
              <CategoryPage
                title={cfg.title}
                description={cfg.description}
                bannerImg={cfg.bannerImg}
                breadcrumbLabel={cfg.breadcrumbLabel}
                categoryPage={cfg.categoryPage}
                thematical={cfg.thematical}
              />
            }
          />
        ))}
        <Route path="/detail" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
