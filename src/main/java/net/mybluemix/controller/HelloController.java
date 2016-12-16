package net.mybluemix.controller;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Locale;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.plugins.jpeg.JPEGImageWriteParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.multipart.MultipartFile;

import com.ibm.watson.developer_cloud.visual_recognition.v3.VisualRecognition;
import com.ibm.watson.developer_cloud.visual_recognition.v3.model.ClassifyImagesOptions;
import com.ibm.watson.developer_cloud.visual_recognition.v3.model.DetectedFaces;
import com.ibm.watson.developer_cloud.visual_recognition.v3.model.VisualClassification;
import com.ibm.watson.developer_cloud.visual_recognition.v3.model.VisualRecognitionOptions;

import net.mybluemix.model.Dengon;

@RestController
public class HelloController {

	@Autowired
	private SimpMessagingTemplate simpmessage;

	@RequestMapping("/test")
	public VisualClassification greeting() {
		VisualRecognition service = new VisualRecognition(VisualRecognition.VERSION_DATE_2016_05_20);
		service.setApiKey("ee08899658034e2f4ca599d2c2ba32da6eaa3435");

		System.out.println("Classify an image");
		ClassifyImagesOptions options = new ClassifyImagesOptions.Builder().images(new File("src/test.jpg")).build();
		VisualClassification result = service.classify(options).execute();

		System.out.println(result);

		return result;
	}

	@RequestMapping(value = "/up", method = RequestMethod.POST)
	public String post(@RequestParam MultipartFile multipartFile, WebRequest request) throws IOException {

		// ファイルが空の場合は異常終了
		if (multipartFile.isEmpty()) {
			// 異常終了時の処理
			return null;
		} else {
			makeTempDir();
			VisualRecognition service = new VisualRecognition(VisualRecognition.VERSION_DATE_2016_05_20);
			service.setApiKey("ee08899658034e2f4ca599d2c2ba32da6eaa3435");
			String suffix = getSuffix(multipartFile.getOriginalFilename());
			String fName = DigestUtils.md5DigestAsHex(
					(multipartFile.getOriginalFilename() + request.getSessionId()).getBytes()) + "." + suffix;

			File imageF = convert(multipartFile, fName);
			File out = new File(System.getProperty("user.dir") + "/temp/temp" + fName);
			out.createNewFile();
			BufferedImage image = ImageIO.read(imageF);
			JPEGImageWriteParam param = new JPEGImageWriteParam(Locale.getDefault());
			param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
			param.setCompressionQuality(0.9f);

			ImageWriter writer = ImageIO.getImageWritersByFormatName(suffix).next();
			writer.setOutput(ImageIO.createImageOutputStream(out));
			writer.write(null, new IIOImage(image, null, null), param);
			writer.dispose();
			if ((out.length() / 1024.0 / 1024.0) > 2.0) {
				return "{\"out\":\"" + String.format("%.3f", (out.length() / 1024.0 / 1024.0)) + "MB" + "\"}";
			}

			// System.out.println("Classify an image");
			ClassifyImagesOptions options = new ClassifyImagesOptions.Builder().images(out).build();
			VisualClassification result = service.classify(options).execute();
			VisualRecognitionOptions vop = new VisualRecognitionOptions.Builder().images(out).build();
			DetectedFaces df = service.detectFaces(vop).execute();

			// tempファイル削除
			imageF.delete();
			out.delete();
			// System.out.println(result);
			return "{\"result\":[" + result.toString() + "," + df.toString() + "," + out.length() + "]}";
		}

	}

	public File convert(MultipartFile file, String fName) throws IOException {
		File convFile = new File(System.getProperty("user.dir") + "/temp/" + fName);
		convFile.createNewFile();
		FileOutputStream fos = new FileOutputStream(convFile);
		fos.write(file.getBytes());
		fos.close();
		return convFile;
	}

	public void makeTempDir() {
		File mkdir = new File(System.getProperty("user.dir") + "/temp");
		if (!mkdir.exists())
			mkdir.mkdirs();
	}

	public static String getSuffix(String fileName) {
		if (fileName == null)
			return null;
		int point = fileName.lastIndexOf(".");
		if (point != -1) {
			return fileName.substring(point + 1);
		}
		return fileName;
	}

	@RequestMapping(value = "/dengon", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
	public String dengonController(@RequestBody Dengon dengon) {
		simpmessage.convertAndSend("/topic/dengon", dengon);
		return "test";
	}

}