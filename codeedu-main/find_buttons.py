from PIL import Image

def find_yellow_boxes():
    img = Image.open('public/ccat.png').convert('RGB')
    width, height = img.size
    
    # Target yellow color: roughly (255, 230, 0) to (255, 255, 0)
    # Let's check a range of yellow
    
    yellow_pixels = []
    for y in range(height):
        for x in range(width):
            r, g, b = img.getpixel((x, y))
            # Yellow is high R, high G, low B
            if r > 200 and g > 200 and b < 50:
                yellow_pixels.append((x, y))
                
    if not yellow_pixels:
        print("No yellow pixels found")
        return
        
    # cluster pixels to find bounding boxes
    # simplistic approach: group by proximity
    boxes = []
    
    print(f"Found {len(yellow_pixels)} yellow pixels. Finding bounding boxes...")
    
    # Just find the min/max x,y in chunks
    # Since buttons are well separated vertically:
    # cluster by y coordinate first
    
    y_clusters = []
    current_cluster = []
    last_y = -100
    
    # sort by y first
    yellow_pixels.sort(key=lambda p: p[1])
    
    for px, py in yellow_pixels:
        if py - last_y > 100 and current_cluster:
            y_clusters.append(current_cluster)
            current_cluster = []
        current_cluster.append((px, py))
        last_y = py
        
    if current_cluster:
        y_clusters.append(current_cluster)
        
    for i, cluster in enumerate(y_clusters):
        min_x = min(p[0] for p in cluster)
        max_x = max(p[0] for p in cluster)
        min_y = min(p[1] for p in cluster)
        max_y = max(p[1] for p in cluster)
        
        print(f"Button {i+1}: x=({min_x}, {max_x}), y=({min_y}, {max_y}), width={max_x-min_x}, height={max_y-min_y}")
        
        # calculate percentages
        pct_x = (min_x / width) * 100
        pct_y = (min_y / height) * 100
        pct_w = ((max_x - min_x) / width) * 100
        pct_h = ((max_y - min_y) / height) * 100
        
        print(f"   CSS: left: {pct_x:.2f}%, top: {pct_y:.2f}%, width: {pct_w:.2f}%, height: {pct_h:.2f}%")

find_yellow_boxes()
