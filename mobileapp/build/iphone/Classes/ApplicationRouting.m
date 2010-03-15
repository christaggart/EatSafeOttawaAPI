/**
 * Appcelerator Titanium Mobile
 * This is generated code. Do not modify. Your changes *will* be lost.
 * Generated code is Copyright (c) 2009-2010 by Appcelerator, Inc.
 * All Rights Reserved.
 */
#import <Foundation/Foundation.h>
#import "ApplicationRouting.h"

extern NSData * decode64 (NSData * thedata); 
extern NSData * dataWithHexString (NSString * hexString);
extern NSData * decodeDataWithKey (NSData * thedata, NSString * key);

@implementation ApplicationRouting

+ (NSData*) resolveAppAsset:(NSString*)path;
{
     static NSMutableDictionary *map;
     if (map==nil)
     {
         map = [[NSMutableDictionary alloc] init];
         [map setObject:dataWithHexString(@"546974616e69756d2e55492e7365744261636b67726f756e64436f6c6f7228272330303027293b7661722074616247726f75703d546974616e69756d2e55492e63726561746554616247726f757028293b7661722077696e313d546974616e69756d2e55492e63726561746557696e646f77287b7469746c653a274561742053616665204f7474617761272c6261636b67726f756e64436f6c6f723a2723666666277d293b76617220746162313d546974616e69756d2e55492e637265617465546162287b69636f6e3a274b535f6e61765f76696577732e706e67272c7469746c653a27506c61636573272c77696e646f773a77696e317d293b76617220726566726573683d546974616e69756d2e55492e637265617465427574746f6e287b73797374656d427574746f6e3a546974616e69756d2e55492e6950686f6e652e53797374656d427574746f6e2e524546524553487d293b726566726573682e6164644576656e744c697374656e65722827636c69636b272c66756e6374696f6e28290a7b546974616e69756d2e55492e637265617465416c6572744469616c6f67287b7469746c653a27426c6168272c6d6573736167653a2752454652455348277d292e73686f7728293b546974616e69756d2e4150492e6465627567282272656672657368206c6f636174696f6e202b206e656172627922293b7d293b77696e312e626172436f6c6f723d2723333835323932273b766172207365617263683d546974616e69756d2e55492e637265617465536561726368426172287b626172436f6c6f723a2723333835323932272c73686f7743616e63656c3a66616c73657d293b7365617263682e6164644576656e744c697374656e657228276368616e6765272c66756e6374696f6e2865290a7b652e76616c75657d293b7365617263682e6164644576656e744c697374656e6572282772657475726e272c66756e6374696f6e2865290a7b7365617263682e626c757228293b7d293b7365617263682e6164644576656e744c697374656e6572282763616e63656c272c66756e6374696f6e2865290a7b7365617263682e626c757228293b7d293b766172207461626c65566965773b76617220646174613d5b5d3b76617220726f773d54692e55492e6372656174655461626c6556696577526f7728293b726f772e6261636b67726f756e64436f6c6f723d2723393739373937273b726f772e73656c65637465644261636b67726f756e64436f6c6f723d2723333835323932273b726f772e6865696768743d34303b76617220636c69636b4c6162656c3d546974616e69756d2e55492e6372656174654c6162656c287b746578743a274e6561726279272c636f6c6f723a2723666666272c74657874416c69676e3a276c656674272c666f6e743a7b666f6e7453697a653a31347d2c77696474683a276175746f272c6865696768743a276175746f277d293b726f772e636c6173734e616d653d27686561646572273b726f772e61646428636c69636b4c6162656c293b646174612e7075736828726f77293b76617220757064617465526f773d54692e55492e6372656174655461626c6556696577526f7728293b757064617465526f772e6261636b67726f756e64436f6c6f723d2723313333383663273b757064617465526f772e73656c65637465644261636b67726f756e64436f6c6f723d2723313333383663273b757064617465526f772e6973557064617465526f773d747275653b76617220757064617465526f77546578743d54692e55492e6372656174654c6162656c287b636f6c6f723a2723666666272c666f6e743a7b666f6e7453697a653a32302c666f6e745765696768743a27626f6c64277d2c746578743a27596f7520636c69636b6564206f6e2e2e2e272c77696474683a276175746f272c6865696768743a276175746f277d293b757064617465526f772e61646428757064617465526f7754657874293b7661722063757272656e74526f773d6e756c6c3b7661722063757272656e74526f77496e6465783d6e756c6c3b666f722876617220633d313b633c35303b632b2b290a7b76617220726f773d54692e55492e6372656174655461626c6556696577526f7728293b726f772e73656c65637465644261636b67726f756e64436f6c6f723d2723666666273b726f772e6865696768743d3130303b726f772e636c6173734e616d653d2764617461726f77273b7661722070686f746f3d54692e55492e63726561746556696577287b6261636b67726f756e64496d6167653a272e2e2f696d616765732f637573746f6d5f7461626c65766965772f757365722e706e67272c746f703a352c6c6566743a31302c77696474683a35302c6865696768743a35307d293b70686f746f2e6164644576656e744c697374656e65722827636c69636b272c66756e6374696f6e2865290a7b54692e4150492e696e666f282770686f746f20636c69636b20272b652e736f757263652e726f774e756d2b27206e657720726f7720272b757064617465526f77293b76617220726f774e756d3d652e736f757263652e726f774e756d3b757064617465526f77546578742e746578743d27596f7520636c69636b6564206f6e207468652070686f746f273b7d293b70686f746f2e726f774e756d3d633b726f772e6164642870686f746f293b76617220757365723d54692e55492e6372656174654c6162656c287b636f6c6f723a2723353736393936272c666f6e743a7b666f6e7453697a653a31362c666f6e745765696768743a27626f6c64272c666f6e7446616d696c793a27417269616c277d2c6c6566743a37302c746f703a322c6865696768743a33302c77696474683a3230302c746578743a273120464f5220272b632b272050495a5a4120277d293b757365722e6164644576656e744c697374656e65722827636c69636b272c66756e6374696f6e2865290a7b76617220726f774e756d3d652e736f757263652e726f774e756d3b757064617465526f77546578742e746578743d27596f7520636c69636b6564206f6e207468652075736572273b7d293b726f772e66696c7465723d757365722e746578743b757365722e726f774e756d3d633b726f772e6164642875736572293b76617220636f6d6d656e743d54692e55492e6372656174654c6162656c287b636f6c6f723a2723323232272c666f6e743a7b666f6e7453697a653a31362c666f6e745765696768743a276e6f726d616c272c666f6e7446616d696c793a27417269616c277d2c6c6566743a37302c746f703a32312c6865696768743a35302c77696474683a3230302c746578743a27313233342042616e6b2053742e277d293b636f6d6d656e742e6164644576656e744c697374656e65722827636c69636b272c66756e6374696f6e2865290a7b76617220726f774e756d3d652e736f757263652e726f774e756d3b757064617465526f77546578742e746578743d27596f7520636c69636b6564206f6e2074686520636f6d6d656e74273b7d293b636f6d6d656e742e726f774e756d3d633b726f772e61646428636f6d6d656e74293b7661722063616c656e6461723d54692e55492e63726561746556696577287b6261636b67726f756e64496d6167653a272e2e2f696d616765732f637573746f6d5f7461626c65766965772f6576656e7473427574746f6e2e706e67272c626f74746f6d3a322c6c6566743a37302c77696474683a33322c6865696768743a33327d293b63616c656e6461722e6164644576656e744c697374656e65722827636c69636b272c66756e6374696f6e2865290a7b76617220726f774e756d3d652e736f757263652e726f774e756d3b757064617465526f77546578742e746578743d27596f7520636c69636b6564206f6e207468652063616c656e646172273b7d293b63616c656e6461722e726f774e756d3d633b726f772e6164642863616c656e646172293b76617220627574746f6e3d54692e55492e63726561746556696577287b6261636b67726f756e64496d6167653a272e2e2f696d616765732f637573746f6d5f7461626c65766965772f636f6d6d656e74427574746f6e2e706e67272c746f703a33352c72696768743a352c77696474683a33362c6865696768743a33347d293b627574746f6e2e6164644576656e744c697374656e65722827636c69636b272c66756e6374696f6e2865290a7b76617220726f774e756d3d652e736f757263652e726f774e756d3b757064617465526f77546578742e746578743d27596f7520636c69636b6564206f6e2074686520636f6d6d656e7420627574746f6e273b7d293b627574746f6e2e726f774e756d3d633b726f772e61646428627574746f6e293b646174612e7075736828726f77293b7d0a7461626c65566965773d546974616e69756d2e55492e6372656174655461626c6556696577287b646174613a646174612c7365617263683a7365617263682c66696c7465724174747269627574653a2766696c746572277d293b7461626c65566965772e6164644576656e744c697374656e65722827636c69636b272c66756e6374696f6e2865290a7b69662863757272656e74526f77213d6e756c6c2626652e726f772e6973557064617465526f773d3d66616c7365290a7b7d0a63757272656e74526f773d652e726f773b63757272656e74526f77496e6465783d652e696e6465783b7d290a77696e312e616464287461626c6556696577293b77696e312e73657452696768744e6176427574746f6e2872656672657368293b7661722077696e323d546974616e69756d2e55492e63726561746557696e646f77287b7469746c653a2741626f7574272c6261636b67726f756e64436f6c6f723a2723666666277d293b76617220746162323d546974616e69756d2e55492e637265617465546162287b69636f6e3a274b535f6e61765f75692e706e67272c7469746c653a2741626f7574272c77696e646f773a77696e327d293b766172206c6162656c323d546974616e69756d2e55492e6372656174654c6162656c287b636f6c6f723a2723393939272c746578743a274920616d2057696e646f772032272c666f6e743a7b666f6e7453697a653a32302c666f6e7446616d696c793a2748656c766574696361204e657565277d7d293b77696e322e616464286c6162656c32293b74616247726f75702e6164645461622874616231293b74616247726f75702e6164645461622874616232293b546974616e69756d2e47656f6c6f636174696f6e2e67657443757272656e74506f736974696f6e2866756e6374696f6e28706f73297b546974616e69756d2e4150492e646562756728706f732e636f6f7264732e6c617469747564652b222c20222b706f732e636f6f7264732e6c6f6e676974756465293b7d2c66756e6374696f6e28297b546974616e69756d2e4150492e64656275672822436f756c646e277420676574206c6f636174696f6e22293b7d293b7472797b766172207868723d546974616e69756d2e4e6574776f726b2e63726561746548545450436c69656e7428293b7868722e6f70656e2827474554272c27687474703a2f2f6f70656e6f74746177612e6f72672f6170692f6673692f6e65617262792e70687027293b7868722e6f6e6c6f61643d66756e6374696f6e28297b616c65727428746869732e726573706f6e736554657874293b7d3b7d0a636174636828657272297b546974616e69756d2e55492e637265617465416c6572744469616c6f67287b7469746c653a224572726f72222c6d6573736167653a537472696e6728657272292c627574746f6e4e616d65733a5b274f4b275d7d292e73686f7728293b7d0a74616247726f75702e6f70656e28293b") forKey:@"app_js"];
     }
     return [map objectForKey:path];
}

@end
