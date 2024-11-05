import React, { useState, useCallback } from 'react';
import { SearchIcon, PlusCircle, ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast-context';
import { formatCurrency, calculatePriceChange } from '@/lib/utils'; // Create these utility functions

// Separate components into their own files in practice
const Header = React.memo(() => (
  <header className="flex items-center justify-between p-4 border-b">
    <a href="/" className="text-2xl font-bold text-primary">PriceTrack</a>
    <Button variant="outline" className="flex items-center gap-2">
      <PlusCircle className="w-4 h-4" />
      Track New
    </Button>
  </header>
));

const ProductCard = React.memo(({ product }) => {
  const priceChangeAbs = Math.abs(product.priceChange);
  const isNegativeChange = product.priceChange < 0;

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.platform}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">
              {formatCurrency(product.currentPrice)}
            </div>
            <div className={`flex items-center gap-1 ${isNegativeChange ? 'text-red-500' : 'text-green-500'}`}>
              {isNegativeChange ? (
                <ArrowDownIcon className="w-4 h-4" />
              ) : (
                <ArrowUpIcon className="w-4 h-4" />
              )}
              {formatCurrency(priceChangeAbs)} ({product.priceChangePercent.toFixed(1)}%)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

const ProductList = () => {
  const [sortType, setSortType] = useState('name');
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Smartphone X',
      platform: 'Tokopedia',
      currentPrice: 3500000,
      priceChange: -200000,
      priceChangePercent: 5.4
    },
	{
	id: 2,
      name: 'Laptop Y',
      platform: 'Shopee',
      currentPrice: 7640000,
      priceChange: -350000,
      priceChangePercent: 2.4
	},
	{
	id: 3,
      name: 'Sendal Jepit',
      platform: 'Bukalapak',
      currentPrice: 30000,
      priceChange: +1000,
      priceChangePercent: 0.1
	}
  ]);

  const sortedProducts = React.useMemo(() => {
    return [...products].sort((a, b) => {
      if (sortType === 'name') {
        return a.name.localeCompare(b.name);
      }
      return sortType === 'price' ? a.currentPrice - b.currentPrice : 0;
    });
  }, [products, sortType]);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Button 
          variant="outline" 
          onClick={() => setSortType('name')}
          className={sortType === 'name' ? 'bg-primary/10' : ''}
        >
          Sort by Name
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setSortType('price')}
          className={sortType === 'price' ? 'bg-primary/10' : ''}
        >
          Sort by Price
        </Button>
      </div>
      <div className="space-y-4">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

const TrackNewForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    url: '',
    platform: ''
  });

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      // Add API call here
      toast({
        title: "Success",
        description: "Product tracking started successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start tracking product",
        variant: "destructive",
      });
    }
  }, [formData, toast]);

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Track New Product</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium mb-1">Product URL:</label>
          <Input
            id="url"
            type="url"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="Enter product URL"
            required
          />
        </div>
        <div>
          <label htmlFor="platform" className="block text-sm font-medium mb-1">Platform:</label>
          <Select
            value={formData.platform}
            onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
            required
          >
            <SelectTrigger id="platform">
              <SelectValue placeholder="Select a platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tokopedia">Tokopedia</SelectItem>
              <SelectItem value="shopee">Shopee</SelectItem>
              <SelectItem value="bukalapak">Bukalapak</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full">Start Tracking</Button>
      </div>
    </form>
  );
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4">
        <div className="mb-4">
          <div className="relative">
            <Input 
              type="search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..." 
              className="pl-10"
            />
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        <Tabs defaultValue="my-products">
          <TabsList>
            <TabsTrigger value="my-products">My Products</TabsTrigger>
            <TabsTrigger value="price-alerts">Price Alerts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-products">
            <ProductList />
          </TabsContent>
          
          <TabsContent value="price-alerts">
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                You have no active price alerts.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Price History Chart</h2>
            </CardHeader>
            <CardContent>
              {/* Add chart component here */}
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-gray-500">
        © {new Date().getFullYear()} PriceTrack App
      </footer>
    </div>
  );
};

export default App;